/*
* IndexedDB
* */

function createDatabase() {
    // apakah browser support dengan IDB
    if (!('indexedDB' in window)) {
        console.log('Web Browser tidak mendukung IDB');
        return;
    }
    // membuat database
    var request = window.indexedDB.open('db-a1');

    request.onerror = tanganiError;
    request.onupgradeneeded = (e) => {
        var db = e.target.result;
        db.onerror = tanganiError;
        // Buat objek baru
        var objStore = db.createObjectStore('form_login',{keyPath : 'kode'});
        console.log('Object form_login berhasil dibuat');
    }
    request.onsuccess = (e) => {
        db = e.target.result;
        db.onerror = tanganiError;
        console.log('Berhasil melakukan koneksi ke IDB');
        // LAKUKAN SESUATU ...
        bacaDariDB();
    }
}

function tanganiError(e) {
    console.log('Error IDB ' + e.target.errorCode);
}

createDatabase();
var tabel = document.getElementById('tabel-form_login'),
    form = document.getElementById('form-tambah'),
    nama = document.getElementById('nama'),
    kode = document.getElementById('kode'),
    Harga = document.getElementById('Harga');

form.addEventListener('submit', tambahBaris);

function tambahBaris(e) {
    // cek apakah kode sudah ada di tabel
    if (tabel.rows.namedItem(kode.value)){
        alert("Error : form_login sudah terdaftar");
        e.preventDefault();
        return;
    }
    // masukkan ke database
    insertKeDB({
        kode : kode.value,
        nama : nama.value,
        Harga : Harga.value,
    });

    // modifikasi tabel dengan manggunakan fungsi appendChild()
    var baris = tabel.insertRow(); // => <tr></tr>
    baris.id = kode.value; // => <tr id="123"> </tr>
    baris.insertCell().appendChild(document.createTextNode(kode.value));
    baris.insertCell().appendChild(document.createTextNode(nama.value));
    baris.insertCell().appendChild(document.createTextNode(Harga.value));

    // button
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Hapus';
    btn.id = kode.value;
    btn.className = 'btn btn-danger btn-sm';
    baris.insertCell().appendChild(btn);
    e.preventDefault();
}

function insertKeDB(form_login) {
    var objStore = buatTransaksi().objectStore('form_login');
    var request = objStore.add(form_login);
    request.onerror = tanganiError;
    request.onsuccess = console.log("form_login kode " + form_login.kode +
    'berhasil ditambahkan ke DB');
}

function buatTransaksi() {
    var transaksi = db.transaction(['form_login'],'readwrite');
    transaksi.onerror = tanganiError;
    transaksi.oncomplete = console.log("Transaksi selesai");

    return transaksi;
}

function bacaDariDB (){
    var objStore = buatTransaksi().objectStore('form_login');
    objStore.openCursor().onsuccess = (e) => {
        var result = e.target.result;
        if (result){
            console.log('Membaca ['+result.value.kode+'] dari IDB');

            // append data ke tabel
            var baris = tabel.insertRow(); // => <tr></tr>
            baris.id = result.value.kode; // => <tr id="123"> </tr>
            baris.insertCell().appendChild(document.createTextNode(result.value.kode));
            baris.insertCell().appendChild(document.createTextNode(result.value.nama));
            baris.insertCell().appendChild(document.createTextNode(result.value.Harga));

            // button
            var btn = document.createElement('input');
            btn.type = 'button';
            btn.value = 'Hapus';
            btn.id = result.value.kode;
            btn.className = 'btn btn-danger btn-sm';
            baris.insertCell().appendChild(btn);
            result.continue();
        }
    }
}

tabel.addEventListener('click',hapusBaris);
function hapusBaris(e) {
    if (e.target.type === 'button'){
        var hapus = confirm('Apakah anda yakin untuk menghapus data ?');
        if (hapus){
            tabel.deleteRow(tabel.rows.namedItem(e.target.id).sectionRowIndex);
            // kemudian hapus dari DB ...
            hapusDariDB(e.target.id);
        }
    }
}

function hapusDariDB(kode) {
    var objStore = buatTransaksi().objectStore('form_login');
    var request = objStore.delete(kode);
    request.error = tanganiError;
    request.onsuccess = console.log('Berhasil menghapus form_login ['+kode+']');
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }