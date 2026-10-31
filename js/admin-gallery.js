(function () {
  'use strict';

  var auth = window.SiteAdminAuth;
  var client = auth && auth.client;
  var form = document.getElementById('gallery-upload-form');
  var submitButton = document.getElementById('gallery-upload-submit');
  var uploadStatus = document.getElementById('gallery-upload-status');
  var listStatus = document.getElementById('gallery-list-status');
  var list = document.getElementById('gallery-admin-list');
  var categories = [];

  function setText(node, message) { node.textContent = message || ''; }

  function option(select, value, label) {
    var item = document.createElement('option');
    item.value = value;
    item.textContent = label;
    select.appendChild(item);
  }

  async function loadOptions() {
    var categoryResult = await client.from('gallery_categories').select('id,name,slug').eq('is_active', true).order('name');
    if (categoryResult.error) throw categoryResult.error;
    categories = categoryResult.data || [];
    var categorySelect = document.getElementById('gallery-category');
    categorySelect.replaceChildren();
    option(categorySelect, '', 'Choose a category');
    categories.forEach(function (category) { option(categorySelect, category.id, category.name); });

    var eventSelect = document.getElementById('gallery-event');
    var eventResult = await client.from('events').select('id,title,event_date').order('event_date', { ascending: false }).limit(200);
    if (!eventResult.error) {
      (eventResult.data || []).forEach(function (event) {
        option(eventSelect, event.id, (event.title || 'Event') + (event.event_date ? ' · ' + event.event_date : ''));
      });
    }
  }

  function formatSize(bytes) {
    return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  async function makeThumbnail(file) {
    if (!file.type || file.type.indexOf('image/') !== 0 || typeof createImageBitmap !== 'function') return null;
    try {
      var bitmap = await createImageBitmap(file);
      var scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height));
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      var blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/jpeg', 0.82); });
      return blob && blob.size <= 1024 * 1024 ? new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' }) : null;
    } catch (_) {
      return null;
    }
  }

  function createRow(record, signed) {
    var row = document.createElement('article');
    row.className = 'media-row';
    var thumb = document.createElement('div');
    thumb.className = 'media-thumb';
    if (record.media_kind === 'image' && signed && (signed.thumbnailUrl || signed.url)) {
      var image = document.createElement('img');
      image.src = signed.thumbnailUrl || signed.url;
      image.alt = '';
      image.loading = 'lazy';
      thumb.appendChild(image);
    } else {
      var icon = document.createElement('i');
      icon.className = record.media_kind === 'video' ? 'fa-solid fa-circle-play fa-2x' : 'fa-regular fa-image fa-2x';
      icon.setAttribute('aria-hidden', 'true');
      thumb.appendChild(icon);
    }

    var details = document.createElement('div');
    var relation = Array.isArray(record.gallery_categories) ? record.gallery_categories[0] : record.gallery_categories;
    var linkedEvent = Array.isArray(record.events) ? record.events[0] : record.events;
    var title = document.createElement('strong');
    title.textContent = record.file_name || (record.media_kind === 'video' ? 'Video' : 'Image');
    var metadata = document.createElement('p');
    metadata.style.cssText = 'margin:.25rem 0;color:#5b6478;font-size:.78rem';
    metadata.textContent = (record.media_kind === 'video' ? 'Video' : 'Photo') + ' · ' + ((relation && relation.name) || 'Gallery') + (linkedEvent && linkedEvent.title ? ' · ' + linkedEvent.title : '') + ' · ' + formatSize(Number(record.file_size) || 0);
    var caption = document.createElement('input');
    caption.type = 'text';
    caption.maxLength = 500;
    caption.value = record.caption || '';
    caption.className = 'admin-field';
    caption.setAttribute('aria-label', 'Caption');
    details.appendChild(title);
    details.appendChild(metadata);
    details.appendChild(caption);

    var actions = document.createElement('div');
    actions.className = 'media-actions';
    var publish = document.createElement('button');
    publish.type = 'button';
    publish.className = 'button button-muted';
    publish.textContent = record.status === 'published' ? 'Unpublish' : 'Publish';
    publish.addEventListener('click', async function () {
      publish.disabled = true;
      var result = await client.from('gallery_media').update({ status: record.status === 'published' ? 'draft' : 'published' }).eq('id', record.id);
      if (result.error) window.alert('Could not update publish status.');
      await loadMedia();
    });
    var saveCaption = document.createElement('button');
    saveCaption.type = 'button';
    saveCaption.className = 'button button-muted';
    saveCaption.textContent = 'Save caption';
    saveCaption.addEventListener('click', async function () {
      saveCaption.disabled = true;
      var result = await client.from('gallery_media').update({ caption: caption.value.trim() }).eq('id', record.id);
      if (result.error) window.alert('Could not save the caption.');
      else setText(listStatus, 'Caption saved.');
      saveCaption.disabled = false;
    });
    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button';
    remove.style.background = '#dc2626';
    remove.textContent = 'Delete';
    remove.addEventListener('click', async function () {
      if (!window.confirm('Delete this gallery item?')) return;
      remove.disabled = true;
      try {
        await window.AdminMedia.deleteMedia(record.id);
        await loadMedia();
      } catch (_) {
        window.alert('Could not delete this gallery item.');
        remove.disabled = false;
      }
    });
    actions.appendChild(publish);
    actions.appendChild(saveCaption);
    actions.appendChild(remove);
    row.appendChild(thumb);
    row.appendChild(details);
    row.appendChild(actions);
    return row;
  }

  async function loadMedia() {
    setText(listStatus, 'Loading gallery media…');
    list.replaceChildren();
    var result = await client.from('gallery_media')
      .select('id,event_id,category_id,caption,media_kind,status,file_name,file_size,uploaded_at,gallery_categories(name),events(title)')
      .order('uploaded_at', { ascending: false })
      .limit(200);
    if (result.error) throw result.error;
    var records = result.data || [];
    var signed = {};
    for (var offset = 0; offset < records.length; offset += 30) {
      var response = await window.AdminMedia.sign(records.slice(offset, offset + 30).map(function (record) { return record.id; }), true);
      (response.media || []).forEach(function (item) { signed[item.id] = item; });
    }
    if (!records.length) {
      setText(listStatus, 'No uploaded gallery media yet.');
      return;
    }
    setText(listStatus, records.length + ' item' + (records.length === 1 ? '' : 's') + ' · drafts are private until published.');
    records.forEach(function (record) { list.appendChild(createRow(record, signed[record.id])); });
  }

  async function handleUpload(event) {
    event.preventDefault();
    setText(uploadStatus, '');
    var file = document.getElementById('gallery-file').files[0];
    var categoryId = document.getElementById('gallery-category').value;
    if (!file || !categoryId) {
      setText(uploadStatus, 'Choose a file and category.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setText(uploadStatus, 'The maximum upload size is 20 MB.');
      return;
    }
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Uploading…';
    try {
      var thumbnail = await makeThumbnail(file);
      await window.AdminMedia.uploadGallery(file, {
        categoryId: categoryId,
        eventId: document.getElementById('gallery-event').value,
        caption: document.getElementById('gallery-caption').value.trim(),
        thumbnail: thumbnail
      });
      form.reset();
      setText(uploadStatus, 'Uploaded as a private draft. Publish it when ready.');
      await loadMedia();
    } catch (error) {
      setText(uploadStatus, error.message || 'Upload failed.');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Upload as draft';
    }
  }

  async function init() {
    if (!auth || !client) {
      window.location.replace('admin-login.html');
      return;
    }
    var user = await auth.requireAdmin();
    if (!user) return;
    client.auth.onAuthStateChange(function (event) {
      if (event === 'SIGNED_OUT') {
        if (list) list.replaceChildren();
        window.location.replace('admin-login.html');
      } else if (event === 'TOKEN_REFRESHED') {
        window.setTimeout(function () {
          auth.requireAdmin().then(function (verifiedUser) {
            if (!verifiedUser) {
              if (list) list.replaceChildren();
              window.location.replace('admin-login.html');
            }
          });
        }, 0);
      }
    });
    document.getElementById('admin-gallery-logout').addEventListener('click', async function () {
      await client.auth.signOut();
      window.location.replace('admin-login.html');
    });
    document.getElementById('gallery-refresh').addEventListener('click', function () { loadMedia().catch(function () { setText(listStatus, 'Could not load gallery media.'); }); });
    form.addEventListener('submit', handleUpload);
    try {
      await loadOptions();
      await loadMedia();
    } catch (_) {
      setText(listStatus, 'Gallery setup is unavailable. Apply the Supabase gallery migration and deploy the media function.');
    }
  }

  init();
})();
