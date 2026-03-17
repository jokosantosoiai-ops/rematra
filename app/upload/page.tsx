"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function UploadMaterial() {
  const [form, setForm] = useState({ title: "", price: "", seller: "", whatsapp: "" })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    // Tes apakah tombol hidup
    console.log("Tombol diklik");
    
    if (!file || !form.title || !form.price) {
      alert("Lengkapi data dan foto dulu, Pak!");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;

      try {
        const fileName = `resale-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        
        // 1. Upload ke Supabase Storage
        const { error: storageError } = await supabase.storage
          .from("material-photos")
          .upload(fileName, file);

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from("material-photos")
          .getPublicUrl(fileName);

        // 2. Simpan ke Tabel Materials
        const { error: dbError } = await supabase
          .from("materials")
          .insert([{
            title: form.title,
            price: parseInt(form.price),
            seller_name: form.seller,
            seller_whatsapp: form.whatsapp,
            photo_url: publicUrl,
            lat,
            lng,
            location: `POINT(${lng} ${lat})`
          }]);

        if (dbError) throw dbError;

        alert("Berhasil! Material Anda sudah tayang.");
        window.location.href = "/marketplace";

      } catch (err: any) {
        alert("Gagal: " + err.message);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      alert("Harus izinkan akses lokasi (GPS) agar bisa upload.");
      setLoading(false);
    });
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upload Sisa Material</h1>
      
      <div className="space-y-4" suppressHydrationWarning>
        <input 
          className="w-full border p-3 rounded text-black" 
          placeholder="Nama Barang (Contoh: Semen Gresik)" 
          onChange={e => setForm({...form, title: e.target.value})}
        />
        <input 
          className="w-full border p-3 rounded text-black" 
          type="number" 
          placeholder="Harga Total (Rp)" 
          onChange={e => setForm({...form, price: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-3 rounded text-black" placeholder="Nama Anda" onChange={e => setForm({...form, seller: e.target.value})} />
          <input className="border p-3 rounded text-black" placeholder="WA (0812...)" onChange={e => setForm({...form, whatsapp: e.target.value})} />
        </div>
        
        <div className="border-2 border-dashed p-6 text-center rounded-lg">
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>

        <button 
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-4 text-white font-bold rounded-lg transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
        >
          {loading ? "MENGIRIM DATA..." : "PUBLIKASIKAN SEKARANG"}
        </button>
      </div>
    </div>
  )
}