import React, { useState, useEffect, useCallback } from 'react'; 
import '../App.css';
import {
  FaCog,
  FaHandshake,
  FaWhatsapp,
  FaSearch,
  FaDollarSign,
  FaRoad,
  FaRocket,
  FaGem,
  FaMoneyBillWave,
} from 'react-icons/fa';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import rim1 from '../asserts/rim1.jpg';

function RimsHomePage() {
  const [rims, setRims] = useState([]);
  const [filteredRims, setFilteredRims] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedRim, setSelectedRim] = useState(null);

  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [carouselIndex, setCarouselIndex] = useState({});


  //const navigate = useNavigate();

  // Set axios baseURL depending on localhost or LAN
 useEffect(() => {
  axios.defaults.baseURL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000';
}, []);

  // Fetch all rims
  useEffect(() => {
    axios
      .get('/api/rims')
      .then((res) => setRims(res.data))
      .catch((err) => console.error('Failed to fetch rims:', err));
  }, []);

  // ESC key closes modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        setContactOpen(false);
        setSelectedRim(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Helper to get correct image path
  // ✅ ALWAYS returns a safe array of public image URLs
const getPublicImages = (images) => {
  if (!Array.isArray(images) || images.length === 0) return [];
  return images
    .map((url) => {
      if (!url) return null;
      if (url.includes('/object/public/')) return url;
      return url.replace('/object/mikerims/', '/object/public/mikerims/');
    })
    .filter(Boolean);
};


const nextImage = (id, images) => {
  setCarouselIndex((prev) => ({
    ...prev,
    [id]: ((prev[id] || 0) + 1) % images.length,
  }));
};

const prevImage = (id, images) => {
  setCarouselIndex((prev) => ({
    ...prev,
    [id]: ((prev[id] || 0) - 1 + images.length) % images.length,
  }));
};

  // Filter rims client-side
  
  const fetchFilteredRims = useCallback(() => {
    // filtering logic
    let minPrice = 0;
    let maxPrice = Infinity;

    if (priceFilter === 'under100') maxPrice = 100;
    else if (priceFilter === '100to200') {
      minPrice = 100;
      maxPrice = 200;
    } else if (priceFilter === 'over200') minPrice = 200;

    let maxSize = null;
    if (sizeFilter === 'under18') maxSize = 18;

    const filtered = rims.filter((rim) => {
      const matchesName = rim.name.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter
        ? rim.brand?.trim().toLowerCase() === brandFilter.trim().toLowerCase()
        : true;
      const matchesPrice = rim.price >= minPrice && rim.price <= maxPrice;
      const matchesSize = maxSize ? rim.size < maxSize : true;
      return matchesName && matchesBrand && matchesPrice && matchesSize;
    });

    setFilteredRims(filtered);
  }, [rims, search, priceFilter, sizeFilter, brandFilter]);

  // useEffect for filtering
  useEffect(() => {
    fetchFilteredRims();
  }, [fetchFilteredRims]);


  const arrowStyle = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: '8px',
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
});

  return (
    <div className="app">
      {/* Hero Section with rim1 background */}
      <header
        className="hero"
        style={{
          backgroundImage: `url(${rim1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '1rem',
          padding: '4rem 1rem',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        }}
      >
        <h1>Rims & Tyres Zim</h1>
        <p>Your Trusted Rims & Tyres in Zimbabwe</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '30px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setContactOpen(true)}
            style={{
              padding: '10px 22px',
              fontSize: '0.92rem',
              backgroundColor: '#113c9bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Contact Us
          </button>
        </div>
      </header>

      <section>
        <h2
          style={{
            color: '#113C9BFF',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FaCog style={{ color: '#113C9BFF' }} /> Featured Rims
        </h2>

   
<div className="featured-rim-grid">

          {rims.filter((r) => r.featured === true || r.featured === 'true').length === 0 && (
            <p>No featured rims available</p>
          )}

{rims
  .filter((r) => r.featured === true || r.featured === 'true')
  .slice(0, 4)
  .map((rim, index) => (
    <div
      key={rim._id || index}
      className="rim-card"
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
      onClick={() => setSelectedRim(rim)}
    >
{(() => {
  const images = getPublicImages(rim.images);
  const index = carouselIndex[rim._id] || 0;

  return (
    <div style={{ position: 'relative' }}>
      <img
        src={images[index] || rim1}
        alt={rim.name}
        onError={(e) => (e.currentTarget.src = rim1)}
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />

      {images.length > 1 && (
        <>
          <button
            style={arrowStyle('left')}
            onClick={(e) => {
              e.stopPropagation();
              prevImage(rim._id, images);
            }}
          >
            ‹
          </button>

          <button
            style={arrowStyle('right')}
            onClick={(e) => {
              e.stopPropagation();
              nextImage(rim._id, images);
            }}
          >
            ›
          </button>

          {/* Dots */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex((p) => ({ ...p, [rim._id]: i }));
                }}
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: i === index ? '#2563eb' : '#d1d5db',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
})()}



      <div style={{ padding: '10px' }}>
        <h3 style={{ margin: '5px 0', color: '#065f46' }}>
          {rim.name || 'Unknown Rim'}
        </h3>
        <p style={{ margin: 0, fontWeight: '600', color: '#065f46' }}>
          {rim.brand || 'Unknown Brand'} • ${rim.price || 'N/A'}
        </p>
      </div>
    </div>
  ))}

        </div>
      </section>

      {/* FLOATING SEARCH ICON */}
      <div
        onClick={() => setModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '75px',
          height: '75px',
          borderRadius: '50%',
          backgroundColor: '#113c9bff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(124,58,237,0.35)',
          zIndex: 999,
          transition: '0.25s',
        }}
      >
        <FaSearch style={{ color: 'white', fontSize: '2.4rem' }} />
      </div>

      <section>
        <h2
          style={{
            color: '#113C9BFF',
            border: 'none',
            outline: 'none',
          }}
        >
          <FaHandshake
            className="icon"
            style={{
              color: '#113C9BFF',
              stroke: '#113C9BFF',
              fill: '#113C9BFF',
              fontSize: '22px',
            }}
          />{' '}
          Why Choose Us
        </h2>

        <div className="why-choose-grid">
          <div className="feature-card">
            <div className="icon">
              <FaRocket />
            </div>
            <h3>Fast Delivery</h3>
            <p>Get your rims and tyres delivered quickly and safely.</p>
          </div>
          <div className="feature-card">
            <div className="icon">
              <FaGem />
            </div>
            <h3>Premium Quality</h3>
            <p>Only the best rims and tyres for your vehicle.</p>
          </div>
          <div className="feature-card">
            <div className="icon">
              <FaMoneyBillWave />
            </div>
            <h3>Affordable Prices</h3>
            <p>We offer competitive prices without compromising quality.</p>
          </div>
        </div>
      </section>

      {rims.length > 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: '#065f46' }}>Your Rims:</h3>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rims.map((rim) => (
              <li
                key={rim._id}
                style={{
                  background: '#f0fdf4',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '6px',
                }}
              >
                <strong>{rim.name}</strong> — {rim.size}" — ${rim.price}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginTop: '2rem', color: '#999' }}>
          No rims found. Use "Manage Rims" to upload your first rim.
        </p>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="modal-overlay" onClick={() => setContactOpen(false)}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setContactOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '1.5rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1100,
              }}
            >
              ×
            </button>

            <h2 style={{ color: '#113C9BFF' }}>Contact Us</h2>
            <p>
              <FaWhatsapp style={{ color: '#25D366', marginRight: '8px' }} />
              WhatsApp:{' '}
              <a href="https://wa.me/263775801410" target="_blank" rel="noopener noreferrer">
                +263 775801410
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Rim Detail Modal */}
      {/* Rim Detail Modal */}
{selectedRim && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedRim(null)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1200,
    }}
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
      style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '600px',
        position: 'relative',
      }}
    >
      <button
        onClick={() => setSelectedRim(null)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '20px',
          fontSize: '1.5rem',
          color: '#dc2626',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      {/* Modal carousel */}
      {(() => {
        const images = getPublicImages(selectedRim.images);
        const currentIndex = carouselIndex[selectedRim._id] || 0;

        return (
          <div style={{ position: 'relative' }}>
            <img
              src={images[currentIndex] || rim1}
              alt={selectedRim.name}
              onError={(e) => (e.currentTarget.src = rim1)}
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />

            {images.length > 1 && (
              <>
                <button
                  style={arrowStyle('left')}
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(selectedRim._id, images);
                  }}
                >
                  ‹
                </button>

                <button
                  style={arrowStyle('right')}
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(selectedRim._id, images);
                  }}
                >
                  ›
                </button>

                {/* Dots */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {images.map((_, i) => (
                    <span
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselIndex((p) => ({ ...p, [selectedRim._id]: i }));
                      }}
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: i === currentIndex ? '#2563eb' : '#d1d5db',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* Rim info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ color: '#065f46', margin: 0 }}>
            {selectedRim.name} ({selectedRim.size}")
          </h2>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', margin: '4px 0' }}>
            ${selectedRim.price}
          </p>
        </div>

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/263775801410?text=${encodeURIComponent(
            `Hi, I'm interested in the ${selectedRim.name} (${selectedRim.size} inch). Is it still available?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: '#25D366',
            color: '#fff',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          <FaWhatsapp size={20} />
          Chat
        </a>
      </div>

      <p>Size: {selectedRim.size} inch</p>
      <p>Location: {selectedRim.location}</p>
    </div>
  </div>
)}


      {/* Browse Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content browse-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '1.5rem',
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1100,
              }}
            >
              ×
            </button>

            {/* Filters */}
            <div
              className="filters-box"
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '16px',
                marginBottom: '24px',
                overflowX: 'auto',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              {/* Search box */}
              <div
                className="filter-input"
                style={{ flex: '1 1 180px', minWidth: '180px', position: 'relative' }}
              >
                <FaSearch
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '1rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Price filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 180px', minWidth: '180px', position: 'relative' }}
              >
                <FaDollarSign
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.8rem',
                  }}
                />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Price</option>
                  <option value="under100">Under $100</option>
                  <option value="100to200">$100 – $200</option>
                  <option value="over200">Over $200</option>
                </select>
              </div>

              {/* Size filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 140px', minWidth: '140px', position: 'relative' }}
              >
                <FaRoad
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.8rem',
                  }}
                />
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Size</option>
                  <option value="under18">Under 18</option>
                  <option value="over18">Over 18</option>
                </select>
              </div>

              {/* Brand filter */}
              <div
                className="filter-input"
                style={{ flex: '1 1 140px', minWidth: '140px', position: 'relative' }}
              >
                <FaCog
                  className="filter-icon"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    fontSize: '0.8rem',
                  }}
                />
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8rem',
                    background: '#fff',
                    color: '#111827',
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mercedes">Mercedes</option>
                   <option value="Ford">Ford</option>
                </select>
              </div>
            </div>

            {/* Cars grid */}
            {filteredRims.length === 0 &&
            (search || priceFilter || sizeFilter || brandFilter) ? (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
                ❌ No rims match your filters. Try adjusting your search.
              </p>
            ) : filteredRims.length > 0 ? (
              <div
                className="rim-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredRims.map((rim, index) => (
                  <div
                    className="rim-card"
                    key={index}
                    onClick={() => {
                      setModalOpen(false);
                      setSelectedRim(rim);
                    }}
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      padding: '12px',
                      background: '#fff',
                      fontFamily: "'Poppins', sans-serif",
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                  >
          
{(() => {
  const images = getPublicImages(rim.images);
  const index = carouselIndex[rim._id] || 0;

  return (
    <div style={{ position: 'relative' }}>
      <img
        src={images[index] || rim1}
        alt={rim.name}
        onError={(e) => (e.currentTarget.src = rim1)}
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />

      {images.length > 1 && (
        <>
          <button
            style={arrowStyle('left')}
            onClick={(e) => {
              e.stopPropagation();
              prevImage(rim._id, images);
            }}
          >
            ‹
          </button>

          <button
            style={arrowStyle('right')}
            onClick={(e) => {
              e.stopPropagation();
              nextImage(rim._id, images);
            }}
          >
            ›
          </button>

          {/* Dots */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex((p) => ({ ...p, [rim._id]: i }));
                }}
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: i === index ? '#2563eb' : '#d1d5db',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
})()}



                    <h3 style={{ marginTop: '8px', fontSize: '1rem' }}>{rim.name}</h3>
                    <p style={{ margin: 0, fontWeight: '600', color: '#065f46' }}>
                      ${rim.price} • {rim.size}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
                🔎 No rims yet. Add some to get started!
              </p>
            )}
          </div>
        </div>
      )}
<footer
  style={{
    backgroundColor: '#FFD700',
    color: '#000',
    textAlign: 'center',
    padding: '16px 0',
    fontWeight: '600',
  }}
>
  <p>© 2026 Rims & Tyres Zim • All Rights Reserved</p>
</footer>


    </div>
  );
}

export default RimsHomePage;
