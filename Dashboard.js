import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5001/auctions');
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    navigate('/signin'); 
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Auction Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <Link to="/post-auction">
        <button className="post-auction-btn">Post New Auction</button>
      </Link>

      <div className="auction-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="auction-card">
              <Link to={`/auction/${item._id}`} className="auction-link">
                <h3>{item.itemName}</h3>
                <p><strong>Current Bid:</strong> ${item.currentBid}</p>
                <p className={item.isClosed ? 'closed' : 'open'}>
                  {item.isClosed ? 'Auction Closed' : 'Live Auction'}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p>No active auctions available.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
