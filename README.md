# AMC Website - Amravati Municipal Corporation Portal

A web application for managing citizen complaints and municipal services for the Amravati Municipal Corporation (AMC).

## Features

- **Complaint Management System**: Citizens can file complaints with real-time geolocation detection
- **Complaint Tracking**: View status of submitted complaints (Pending, In Progress, Resolved)
- **Admin Dashboard**: Admin interface to manage and update complaint statuses
- **Service Hub**: Access to important municipal links and services
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
AMC-Website-fixed/
├── FRONTEND/
│   ├── USER/
│   │   ├── index.html              # Main home page
│   │   ├── service-hub.html        # Municipal services listing
│   │   ├── style.css               # Global styles
│   │   ├── script.js               # Frontend logic
│   │   ├── Complaint/              # Complaint filing interface
│   │   │   ├── complaint.html
│   │   │   ├── ComplaintForm.js    # React complaint form component
│   │   │   └── ComplaintForm.css
│   │   └── [images and assets]
│   └── ADMIN/
│       └── admin.html              # Admin login and dashboard
├── BACKEND/
│   └── USER/
│       ├── server.js               # Node.js HTTP server
│       └── data-important-links.json # Municipal services data
├── package.json                    # Project dependencies
└── README.md                        # This file
```

## Installation

1. **Prerequisites**: Make sure you have Node.js installed (v14 or higher)

2. **Clone the repository**:
   ```bash
   git clone <your-github-url>
   cd AMC-Website-fixed
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Start the server:
```bash
npm start
```

The server will run at `http://localhost:3000`

### Access the application:
- **Home Page**: `http://localhost:3000`
- **File a Complaint**: `http://localhost:3000/Complaint/complaint.html`
- **Admin Dashboard**: `http://localhost:3000/admin.html`
- **Service Hub**: `http://localhost:3000/service-hub.html`

## How to Use

### Filing a Complaint (Citizens)

1. Navigate to "File a Complaint" section
2. Click "Detect Location" to capture your current location
3. Fill in complaint details (category, subject, description, priority)
4. Submit the complaint
5. Your complaint will be stored locally and assigned a reference number
6. View your past complaints and their status in the same page

### Admin Dashboard

1. Access the admin dashboard at `/admin.html`
2. Login with your credentials (default: admin / admin)
3. View all submitted complaints in a table format
4. Update complaint status (Pending → In Progress → Resolved)
5. Changes are saved and reflected in the user's complaint history

### Important Links Management

Edit `BACKEND/USER/data-important-links.json` to manage municipal services:
- Add new services
- Update service URLs
- Change service status (active/inactive)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, React (React CDN build)
- **Backend**: Node.js with built-in HTTP module
- **Storage**: Browser LocalStorage (for demo purposes)
- **Geolocation**: Browser Geolocation API with Nominatim reverse geocoding
- **Server**: Node.js HTTP server for static file serving and API endpoints

## API Endpoints

- `GET /api/important-links` - Get all municipal services
- `GET /api/important-links/:slug` - Get specific service details
- `GET /go/:slug` - Redirect to service URL
- `GET /` - Home page
- `GET /admin.html` - Admin dashboard
- `GET /Complaint/complaint.html` - Complaint form
- `GET /service-hub.html` - Service hub page

## Data Storage

Currently, the application uses browser **LocalStorage** for storing complaints. This is suitable for demonstration purposes but should be replaced with a real database (MongoDB, PostgreSQL, etc.) for production use.

### User Complaints Structure:
```javascript
{
  id: timestamp,
  category: "Road Maintenance",
  subject: "Complaint title",
  description: "Detailed complaint",
  location: "City, District, State",
  priority: "high/medium/low",
  status: "Pending/In Progress/Resolved",
  createdAt: ISO timestamp
}
```

## Admin Credentials

**Default Credentials**:
- Username: `admin`
- Password: `admin`

⚠️ **Note**: Change these credentials before deploying to production!

## Browser Requirements

- Modern browser with:
  - ES6 JavaScript support
  - Geolocation API support
  - LocalStorage support
  - CORS support for Nominatim API

## Deployment

### Environment Variables (Optional)
You can set custom port via environment variable:
```bash
PORT=8000 npm start
```

### Production Deployment Steps

1. Install Node.js on your server
2. Clone the repository
3. Run `npm install`
4. Set up a reverse proxy (Nginx/Apache) to forward requests to Node.js
5. Use a process manager (PM2) to keep the server running
6. Consider adding HTTPS/SSL certificate
7. Replace LocalStorage with a real database
8. Implement proper authentication for admin panel

### Using PM2 for Production

```bash
npm install -g pm2
pm2 start BACKEND/USER/server.js --name "amc-server"
pm2 startup
pm2 save
```

## Future Enhancements

- [ ] User authentication and registration
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email notifications for complaint status updates
- [ ] SMS notifications
- [ ] Image upload for complaints
- [ ] Admin user management
- [ ] Real-time notification system
- [ ] Mobile app
- [ ] PDF report generation
- [ ] Multi-language support

## License

This project is open source and available for municipal use.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## Support

For issues or questions, please contact the development team.

---

**Last Updated**: April 2026  
**Version**: 1.0.0
