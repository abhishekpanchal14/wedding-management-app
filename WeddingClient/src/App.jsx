import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    plan: ''
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)

  useEffect(() => {
    fetchVendors()
  }, [])

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5236'

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vendors`)
      if (!response.ok) throw new Error('Failed to fetch vendors')
      const data = await response.json()
      setVendors(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0])
  }

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validate file sizes (max 50MB each)
      if (photoFile && photoFile.size > 50 * 1024 * 1024) {
        setError('Photo file is too large (max 50MB)')
        return
      }
      if (videoFile && videoFile.size > 100 * 1024 * 1024) {
        setError('Video file is too large (max 100MB)')
        return
      }

      const data = new FormData()
      data.append('name', formData.name)
      data.append('category', formData.category)
      data.append('description', formData.description)
      data.append('plan', formData.plan)
      
      if (photoFile) {
        data.append('photo', photoFile)
      }
      
      if (videoFile) {
        data.append('video', videoFile)
      }

      const response = await fetch(`${API_BASE_URL}/api/vendors/upload`, {
        method: 'POST',
        body: data
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add vendor')
      }
      
      await fetchVendors()
      setFormData({ name: '', category: '', description: '', plan: '' })
      setPhotoFile(null)
      setVideoFile(null)
      setShowForm(false)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Upload error:', err)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading vendors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">Error: {error}</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <button className="header-menu-btn">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1>Wedding Atelier</h1>
          </div>
          <div className="header-right">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="add-vendor-btn"
            >
              Add Vendor
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-label">Wedding Management</span>
            <h2 className="hero-title">
              Your Dream Wedding <br/><span className="italic">Begins Here</span>
            </h2>
            <p className="hero-description">
              Connect with the finest wedding vendors and artisans for your special day.
            </p>
          </div>
        </section>

        {/* Vendors Section */}
        <section className="vendors-section">
          <div className="section-header">
            <h3>Our Featured Vendors</h3>
            <p>Discover exceptional wedding professionals ready to make your day unforgettable.</p>
          </div>

          <div className="vendors-grid">
            {vendors.map(vendor => (
              <div key={vendor.id} className="vendor-card" onClick={() => setSelectedVendor(vendor)}>
                {vendor.photoUrl && (
                  <div className="vendor-media-photo">
                    <img src={`${API_BASE_URL}${vendor.photoUrl}`} alt={vendor.name} />
                  </div>
                )}
                <span className="vendor-category">{vendor.category}</span>
                <h4 className="vendor-name">{vendor.name}</h4>
                <p className="vendor-description">{vendor.description}</p>
                
                {vendor.videoUrl && (
                  <div className="vendor-media-video">
                    <video width="100%" height="auto" controls>
                      <source src={`${API_BASE_URL}${vendor.videoUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                <div className="vendor-footer">
                  <span className="vendor-plan">{vendor.plan}</span>
                  <span className="material-symbols-outlined" onClick={(e) => {
                    e.stopPropagation()
                    setSelectedVendor(vendor)
                  }}>arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor Detail Modal */}
        {selectedVendor && (
          <div className="modal-overlay" onClick={() => setSelectedVendor(null)}>
            <div className="vendor-detail-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="detail-close-btn"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="detail-media-gallery">
                {selectedVendor.photoUrl && (
                  <div className="detail-media-item photo">
                    <img src={`${API_BASE_URL}${selectedVendor.photoUrl}`} alt={selectedVendor.name} />
                  </div>
                )}
                {selectedVendor.videoUrl && (
                  <div className="detail-media-item video">
                    <video controls>
                      <source src={`${API_BASE_URL}${selectedVendor.videoUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              <div className="detail-content">
                <div className="detail-header">
                  <div>
                    <h2>{selectedVendor.name}</h2>
                    <span className="detail-category">{selectedVendor.category}</span>
                  </div>
                  <span className="detail-plan">{selectedVendor.plan}</span>
                </div>

                <p className="detail-description">{selectedVendor.description}</p>

                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{selectedVendor.category}</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-label">Plan</span>
                    <span className="detail-value">{selectedVendor.plan}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="detail-back-btn"
                >
                  Back to Vendors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Vendor Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add New Vendor</h3>
                <button 
                  onClick={() => setShowForm(false)}
                  className="modal-close-btn"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. Elegant Events Co."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Event Planner">Event Planner</option>
                    <option value="Caterer">Caterer</option>
                    <option value="Decorator">Decorator</option>
                    <option value="Florist">Florist</option>
                    <option value="Venue">Venue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Describe your services..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Plan</label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a plan</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Ultimate">Ultimate</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="form-input"
                  />
                  {photoFile && (
                    <div>
                      <span className="file-name">✓ {photoFile.name}</span>
                      <span className="file-size">({(photoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio Video</label>
                  <input
                    type="file"
                    accept="video/*,.mov,.mp4,.webm,.mkv"
                    onChange={handleVideoChange}
                    className="form-input"
                  />
                  {videoFile && (
                    <div>
                      <span className="file-name">✓ {videoFile.name}</span>
                      <span className="file-size">({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="submit-btn"
                >
                  Add Vendor
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <h1>Wedding Atelier</h1>
          <p>Connecting couples with exceptional wedding professionals.</p>
        </div>
      </footer>
    </div>
  )
}

export default App