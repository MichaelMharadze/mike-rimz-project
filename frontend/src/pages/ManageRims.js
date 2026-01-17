import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { supabase } from "../supabase";


function ManageRims() {
  const [rims, setRims] = useState([]);
  const [rim, setRim] = useState({
    name: "",
    brand: "",
    size: "",
    price: "",
    location: "",
    images: [], // ✅ array
    featured: false,
  });

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [selectedRim, setSelectedRim] = useState(null);

  useEffect(() => {
    fetchRims();
  }, []);

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginTop: "5px",
  };

  const fetchRims = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/rims", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRims(res.data);
    } catch (err) {
      console.error("Failed to fetch rims:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRim({ ...rim, [name]: value });
  };

const handleImagesUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const uploadedUrls = [];
  setPreviewImage(null);

  for (const file of files) {
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(fileExt)) continue;

    const fileName = `rims/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("mikerims")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      continue;
    }

    const { data } = supabase.storage
      .from("mikerims")
      .getPublicUrl(fileName);

    uploadedUrls.push(data.publicUrl);
  }

  setRim(prev => ({
    ...prev,
    images: uploadedUrls,
  }));
};




  const addRim = async () => {
   if (rim.name && rim.brand && rim.size && rim.price && rim.images.length && rim.location)
{
      try {
        const token = localStorage.getItem("adminToken");
        await axios.post("http://localhost:5000/api/rims", rim, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("✅ Rim added successfully!");
        setRim({ name: "", brand: "", size: "", price: "", location: "", image: "", featured: false });
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchRims();
      } catch (err) {
        console.error("Failed to add rim:", err.response?.data || err);
        alert("Failed to add rim. See console.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const deleteRim = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rim?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/rims/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRims((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting rim:", err);
      alert("Failed to delete rim. See console.");
    }
  };

  const closePopup = () => setSelectedRim(null);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ color: "#065f46", fontSize: "28px", marginBottom: "1rem" }}>Manage Rims</h2>

      <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "8px", marginBottom: "30px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: "#333", marginBottom: "15px" }}>➕ Add New Rim</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "20px" }}>
          <div>
            <label>Name</label>
            <input type="text" name="name" value={rim.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Alloy Rims" />
          </div>
          <div>
            <label>Brand</label>
            <input type="text" name="brand" value={rim.brand} onChange={handleChange} style={inputStyle} placeholder="e.g. BBS" />
          </div>
          <div>
            <label>Size</label>
            <input type="text" name="size" value={rim.size} onChange={handleChange} style={inputStyle} placeholder="e.g. 18 inch" />
          </div>
          <div>
            <label>Price</label>
            <input type="number" name="price" value={rim.price} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label>Location</label>
            <input type="text" name="location" value={rim.location} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label>Image</label>
            <input
  type="file"
  multiple
  accept="image/*"
  onChange={handleImagesUpload}
  ref={fileInputRef}
/>

          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label>Featured?</label>
            <input type="checkbox" checked={rim.featured} onChange={(e) => setRim({ ...rim, featured: e.target.checked })} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
{(rim.images || []).map((img, i) => (
  <img
    key={i}
    src={img}
    alt="preview"
    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px" }}
  />
))}

</div>


        <button onClick={addRim} style={{ backgroundColor: "#065f46", color: "#fff", padding: "12px 24px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          Add Rim
        </button>
      </div>

      <div className="rim-list" style={{ display: "grid", gap: "20px" }}>
        {rims.length === 0 ? (
          <p style={{ textAlign: "center", fontStyle: "italic" }}>🚘 No rims uploaded yet.</p>
        ) : (
          rims.map((r) => (
            <div key={r._id} onClick={() => setSelectedRim(r)} style={{ cursor: 'pointer', border: "1px solid #ddd", padding: "15px", borderRadius: "6px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <img src={r.images?.[0]} alt={r.name} style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "4px" }} />
              <p><strong>{r.name}</strong> ({r.brand})</p>
              <p>Size: {r.size}</p>
              <p>Price: ${r.price}</p>
              <p>Location: {r.location}</p>
              <button onClick={() => deleteRim(r._id)} style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {selectedRim && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'#fff', padding:'20px', borderRadius:'8px', maxWidth:'600px', width:'90%', maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
            <button onClick={closePopup} style={{ position:'absolute', top:'10px', right:'10px', background:'#dc2626', color:'#fff', border:'none', borderRadius:'4px', padding:'5px 10px', cursor:'pointer' }}>Close</button>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
{(selectedRim.images || []).map((img, i) => (
  <img
    key={i}
    src={img}
    style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "6px" }}
  />
))}

</div>

            <h3 style={{ color:'#065f46' }}>{selectedRim.name}</h3>
            <p><strong>Brand:</strong> {selectedRim.brand}</p>
            <p><strong>Size:</strong> {selectedRim.size}</p>
            <p><strong>Price:</strong> ${selectedRim.price}</p>
            <p><strong>Location:</strong> {selectedRim.location}</p>
            <p><strong>Featured:</strong> {selectedRim.featured ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageRims;
