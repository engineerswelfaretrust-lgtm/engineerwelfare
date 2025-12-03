const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { uploadBuffer } = require('../utils/cloudinaryUpload');
const Engineer = require('../models/Engineer'); // Changed from Doctor
const generateToken = require('../utils/generateToken');
const { sendWelcomeEmail } = require('../utils/emailService');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// use memory storage so we can upload buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/engineers/register
router.post('/register', upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'certificates', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name,
      age,
      sex,
      qualification,
      phone,
      alternateMobile,
      email,
      password,
      houseAddress,
      officeAddress, // Changed from clinicAddress
      nominee,
      familyMember1,
      familyMember2,
      acceptTerms,
      subscribeUpdates
    } = req.body;

    const passportFile = req.files && req.files.passportPhoto ? req.files.passportPhoto[0] : null;
    const certFile = req.files && req.files.certificates ? req.files.certificates[0] : null;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'name, phone, email, password are required' });
    }

    const existing = await Engineer.findOne({ $or: [{ email }, { phone }] }); // Changed from Doctor
    if (existing) {
      return res.status(409).json({ message: 'Engineer with this email or phone already exists' }); // Changed from Doctor
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Parse nominee and validate bank details
    let nomineeObj = nominee ? (typeof nominee === 'string' ? JSON.parse(nominee) : nominee) : undefined;
    if (!nomineeObj || !nomineeObj.bankAccountNumber || !nomineeObj.confirmBankAccountNumber || !nomineeObj.ifscCode || !nomineeObj.bankHolderName) {
      return res.status(400).json({ message: 'Nominee bank details are required.' });
    }
    if (nomineeObj.bankAccountNumber !== nomineeObj.confirmBankAccountNumber) {
      return res.status(400).json({ message: 'Nominee account numbers do not match.' });
    }
    // Remove confirmBankAccountNumber before saving
    delete nomineeObj.confirmBankAccountNumber;

    const engineerData = { // Changed from doctorData
      name,
      age,
      sex,
      qualification,
      phone,
      alternateMobile,
      email,
      passwordHash,
      passportPhoto: null,
      certificates: null,
      houseAddress,
      officeAddress, // Changed from clinicAddress
      nominee: nomineeObj,
      familyMember1: familyMember1 ? (typeof familyMember1 === 'string' ? JSON.parse(familyMember1) : familyMember1) : undefined,
      familyMember2: familyMember2 ? (typeof familyMember2 === 'string' ? JSON.parse(familyMember2) : familyMember2) : undefined,
      acceptTerms: !!acceptTerms,
      subscribeUpdates: !!subscribeUpdates
    };

    // upload files to Cloudinary if present
    if (passportFile) {
      try {
        const uploadRes = await uploadBuffer(passportFile.buffer, {
          folder: 'engineers/passports', // Changed folder
          transformation: [{ width: 500, height: 500, crop: 'fill' }],
          resource_type: 'image'
        });
        if (!uploadRes || !uploadRes.secure_url) {
          throw new Error('Invalid response from Cloudinary upload');
        }
        // Log the full response for debugging (avoid sensitive fields)
        console.log('Cloudinary passport upload response:', {
          public_id: uploadRes.public_id,
          secure_url: uploadRes.secure_url,
          resource_type: uploadRes.resource_type,
          format: uploadRes.format,
          bytes: uploadRes.bytes
        });
        engineerData.passportPhoto = uploadRes.secure_url; // Changed from doctorData
        engineerData.passportPhotoPublicId = uploadRes.public_id; // Changed from doctorData
      } catch (error) {
        console.error('Passport photo upload error:', error);
        return res.status(500).json({ message: 'Failed to upload passport photo: ' + error.message });
      }
    }

    if (certFile) {
      try {
        const uploadRes2 = await uploadBuffer(certFile.buffer, {
          folder: 'engineers/certificates', // Changed folder
          resource_type: 'auto',
          allowed_formats: ['pdf', 'png', 'jpg', 'jpeg']
        });
        if (!uploadRes2 || !uploadRes2.secure_url) {
          throw new Error('Invalid response from Cloudinary upload');
        }
        console.log('Cloudinary certificate upload response:', {
          public_id: uploadRes2.public_id,
          secure_url: uploadRes2.secure_url,
          resource_type: uploadRes2.resource_type,
          format: uploadRes2.format,
          bytes: uploadRes2.bytes
        });
        engineerData.certificates = uploadRes2.secure_url; // Changed from doctorData
        engineerData.certificatesPublicId = uploadRes2.public_id; // Changed from doctorData
      } catch (error) {
        console.error('Certificate upload error:', error);
        return res.status(500).json({ message: 'Failed to upload certificate: ' + error.message });
      }
    }

    try {
      const engineer = await Engineer.create(engineerData); // Changed from Doctor
      const token = generateToken({ id: engineer._id, role: 'engineer' }); // Changed role

      // Send welcome emails to engineer and contacts
      // Fire and forget - don't await to avoid blocking the response
      const engineerObj = engineer.toObject ? engineer.toObject() : engineer; // Changed from doctorObj

      // Fallback to the original submitted data for any nested contacts that might not be present on the saved doc
      const contactPayload = {
        ...engineerObj,
        nominee: engineerObj.nominee && engineerObj.nominee.email ? engineerObj.nominee : (engineerData.nominee || undefined),
        familyMember1: engineerObj.familyMember1 && engineerObj.familyMember1.email ? engineerObj.familyMember1 : (engineerData.familyMember1 || undefined),
        familyMember2: engineerObj.familyMember2 && engineerObj.familyMember2.email ? engineerObj.familyMember2 : (engineerData.familyMember2 || undefined)
      };

      sendWelcomeEmail(contactPayload)
        .then(emailResults => console.log('Email sending results:', emailResults))
        .catch(emailError => console.error('Failed to send welcome emails:', emailError));

      return res.status(201).json({
        success: true,
        data: {
          _id: engineer._id,
          name: engineer.name,
          phone: engineer.phone,
          email: engineer.email,
          token
        }
      });
    } catch (dbError) {
      // Handle specific MongoDB errors
      if (dbError.code === 11000) {
        // Duplicate key error
        return res.status(409).json({
          success: false,
          message: 'An engineer with this email or phone number already exists' // Changed from doctor
        });
      }
      // Log the full error for debugging
      console.error('Error creating engineer:', dbError); // Changed from doctor
      return res.status(500).json({
        success: false,
        message: 'Failed to create engineer account', // Changed from doctor
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in /api/engineers/register:', error); // Changed from doctors
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/engineers/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const engineer = await Engineer.findOne({ email }); // Changed from Doctor
    if (!engineer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, engineer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({ id: engineer._id, role: 'engineer' }); // Changed role
    return res.json({ _id: engineer._id, name: engineer.name, email: engineer.email, token }); // Changed from doctor
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/engineers
// optional query: ?status=approved|pending
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const engineers = await Engineer.find(filter).sort({ createdAt: -1 }); // Changed from Doctor
    return res.json(engineers); // Changed from doctors
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/engineers/:id/approve
router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { disease, message } = req.body;

    if (!disease) {
      return res.status(400).json({ message: 'Disease name is required for approval' });
    }

    const engineer = await Engineer.findById(id); // Changed from Doctor
    if (!engineer) return res.status(404).json({ message: 'Engineer not found' }); // Changed from Doctor

    engineer.status = 'approved';
    engineer.approvedDisease = disease;
    engineer.approvedMessage = message || '';
    engineer.approvedDate = new Date();

    await engineer.save();
    return res.json({ message: 'Approved', engineer }); // Changed from doctor
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/engineers/:id/deceased
router.post('/:id/deceased', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, diseaseName } = req.body;
    const engineer = await Engineer.findById(id); // Changed from Doctor
    if (!engineer) return res.status(404).json({ message: 'Engineer not found' }); // Changed from Doctor
    // For now, mark status as deceased and attach reason/disease
    engineer.status = 'deceased';
    engineer.deceasedReason = reason;
    engineer.deceasedDisease = diseaseName;
    engineer.deceasedDate = new Date();
    await engineer.save();
    return res.json({ message: 'Engineer marked deceased' }); // Changed from Doctor
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/engineers/:id - protected, engineer or admin
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // if engineer role, allow only own id
    if (req.user.role === 'engineer' && req.user.id !== id) { // Changed role
      return res.status(403).json({ message: 'Forbidden' });
    }
    const engineer = await Engineer.findById(id).lean(); // Changed from Doctor
    if (!engineer) return res.status(404).json({ message: 'Engineer not found' }); // Changed from Doctor
    // don't send passwordHash
    delete engineer.passwordHash;
    return res.json(engineer); // Changed from doctor
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/engineers/:id/profile - protected, engineer can update own profile (includes file uploads)
router.patch('/:id/profile', authMiddleware, upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'certificates', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;

    // Authorization: admin or owner
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const engineer = await Engineer.findById(id); // Changed from Doctor
    if (!engineer) return res.status(404).json({ message: 'Engineer not found' }); // Changed from Doctor

    // Debug logging to help trace update issues
    console.log('[PROFILE UPDATE] user:', req.user ? { id: req.user.id, role: req.user.role } : null);
    console.log('[PROFILE UPDATE] body keys:', Object.keys(req.body || {}));
    console.log('[PROFILE UPDATE] files:', Object.keys(req.files || {}));


    // Track changes for notification
    const changes = [];
    const simpleFields = ['name', 'age', 'sex', 'qualification', 'phone', 'email', 'alternateMobile', 'houseAddress', 'officeAddress']; // Changed clinicAddress to officeAddress
    for (const field of simpleFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        const val = req.body[field];
        if (val !== undefined && val !== '' && engineer[field] !== val) { // Changed from doctor
          changes.push({ field, old: engineer[field], new: val }); // Changed from doctor
          engineer[field] = val; // Changed from doctor
        }
      }
    }

    // Nested objects: nominee, familyMember1, familyMember2
    for (const nested of ['nominee', 'familyMember1', 'familyMember2']) {
      if (req.body[nested]) {
        try {
          const parsed = typeof req.body[nested] === 'string' ? JSON.parse(req.body[nested]) : req.body[nested];
          if (nested === 'nominee') {
            // Validate nominee bank details
            if (!parsed.bankAccountNumber || !parsed.confirmBankAccountNumber || !parsed.ifscCode || !parsed.bankHolderName) {
              return res.status(400).json({ message: 'Nominee bank details are required.' });
            }
            if (parsed.bankAccountNumber !== parsed.confirmBankAccountNumber) {
              return res.status(400).json({ message: 'Nominee account numbers do not match.' });
            }
            // Remove confirmBankAccountNumber before saving
            delete parsed.confirmBankAccountNumber;
          }
          if (!engineer[nested]) engineer[nested] = {}; // Changed from doctor
          Object.keys(parsed).forEach(k => {
            if (parsed[k] !== undefined && engineer[nested][k] !== parsed[k]) { // Changed from doctor
              changes.push({ field: `${nested}.${k}`, old: engineer[nested][k], new: parsed[k] }); // Changed from doctor
              engineer[nested][k] = parsed[k]; // Changed from doctor
            }
          });
        } catch (e) {
          console.error(`Failed to parse ${nested}:`, e);
          return res.status(400).json({ message: `Invalid ${nested} format` });
        }
      }
    }

    // Password update
    if (req.body.password && req.body.password.length >= 6) {
      engineer.passwordHash = await bcrypt.hash(req.body.password, 10); // Changed from doctor
    }

    // File uploads
    const passportFile = req.files && req.files.passportPhoto ? req.files.passportPhoto[0] : null;
    const certFile = req.files && req.files.certificates ? req.files.certificates[0] : null;

    if (passportFile) {
      try {
        const uploadRes = await uploadBuffer(passportFile.buffer, {
          folder: 'engineers/passports', // Changed folder
          transformation: [{ width: 500, height: 500, crop: 'fill' }],
          resource_type: 'image'
        });
        if (uploadRes && uploadRes.secure_url) {
          engineer.passportPhoto = uploadRes.secure_url; // Changed from doctor
          engineer.passportPhotoPublicId = uploadRes.public_id; // Changed from doctor
        }
      } catch (err) {
        console.error('Passport upload error:', err);
        return res.status(500).json({ message: 'Failed to upload passport photo' });
      }
    }

    if (certFile) {
      try {
        const uploadRes = await uploadBuffer(certFile.buffer, {
          folder: 'engineers/certificates', // Changed folder
          resource_type: 'auto',
          allowed_formats: ['pdf', 'png', 'jpg', 'jpeg']
        });
        if (uploadRes && uploadRes.secure_url) {
          engineer.certificates = uploadRes.secure_url; // Changed from doctor
          engineer.certificatesPublicId = uploadRes.public_id; // Changed from doctor
        }
      } catch (err) {
        console.error('Certificate upload error:', err);
        return res.status(500).json({ message: 'Failed to upload certificate' });
      }
    }

    await engineer.save(); // Changed from doctor
    const out = engineer.toObject(); // Changed from doctor
    delete out.passwordHash;

    // Send notification email if there are changes
    if (changes.length > 0) {
      // Build a message listing all changes
      let changeDetails = changes.map(c => `<li><b>${c.field}</b>: <span style='color:#888'>${c.old ?? ''}</span> → <span style='color:#2D3748'>${c.new ?? ''}</span></li>`).join('');
      let html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D3748;">Profile Updated</h2>
          <p style="color: #4A5568; font-size: 16px;">Dear Engineer ${engineer.name},</p> <!-- Changed from Dr. -->
          <p style="color: #4A5568; font-size: 16px;">Your profile has been updated with the following changes:</p>
          <ul style="color: #234E52; font-size: 15px;">${changeDetails}</ul>
          <p style="color: #4A5568; font-size: 16px;">If you did not make these changes, please contact support immediately.</p>
          <p style="color: #4A5568; font-size: 16px;">Best regards,<br>The Engineers Community Team</p> <!-- Changed from Doctors -->
        </div>
      `;
      // Send to engineer
      const { sendWelcomeEmail } = require('../utils/emailService');
      const contactPayload = {
        ...out,
        nominee: out.nominee && out.nominee.email ? out.nominee : undefined,
        familyMember1: out.familyMember1 && out.familyMember1.email ? out.familyMember1 : undefined,
        familyMember2: out.familyMember2 && out.familyMember2.email ? out.familyMember2 : undefined,
        updateNotification: {
          html,
          changes
        }
      };

      // Fire and forget - don't await
      sendWelcomeEmail(contactPayload)
        .catch(err => console.error('Failed to send update notification email:', err));
    }
    return res.json({ success: true, message: 'Profile updated', data: out });
  } catch (error) {
    console.error('Error in /:id/profile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/engineers/:id - protected, engineer can update own profile (nominee/family details), admin can update any
// This route now accepts multipart form-data to allow updating images (passportPhoto, certificates)
router.patch('/:id', authMiddleware, upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'certificates', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role === 'engineer' && req.user.id !== id) { // Changed role
      return res.status(403).json({ message: 'Forbidden' });
    }

    const allowedUpdates = ['name', 'age', 'sex', 'qualification', 'phone', 'alternateMobile', 'email', 'houseAddress', 'officeAddress', 'password', 'nominee', 'familyMember1', 'familyMember2']; // Changed clinicAddress to officeAddress
    const engineer = await Engineer.findById(id); // Changed from Doctor
    if (!engineer) return res.status(404).json({ message: 'Engineer not found' }); // Changed from Doctor

    // Log the received data for debugging (excluding sensitive info)
    console.log('Received update fields:', Object.keys(req.body));

    // Apply text-based updates (req.body values may be strings because of multipart)
    for (const key of Object.keys(req.body)) {
      if (!allowedUpdates.includes(key)) {
        console.log('Skipping field:', key); // Debug log
        continue;
      }
      let value = req.body[key];

      // Debug log
      console.log('Processing field:', key);

      // Handle nested objects (nominee, familyMember1, familyMember2)
      if (['nominee', 'familyMember1', 'familyMember2'].includes(key)) {
        try {
          const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
          // Only update fields that are provided in the request
          if (!engineer[key]) engineer[key] = {}; // Changed from doctor
          Object.keys(parsedValue).forEach(field => {
            if (parsedValue[field] !== undefined) {
              engineer[key][field] = parsedValue[field]; // Changed from doctor
            }
          });
          continue;
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
          return res.status(400).json({ message: `Invalid ${key} data format` });
        }
      }

      // Handle password separately
      if (key === 'password') {
        if (value && value.length >= 6) {
          const bcrypt = require('bcryptjs');
          engineer.passwordHash = await bcrypt.hash(value, 10); // Changed from doctor
        }
        continue;
      }

      // Handle regular fields
      if (value !== undefined && value !== '') {
        engineer[key] = value; // Changed from doctor
      }
    }

    // Handle file uploads if present
    const passportFile = req.files && req.files.passportPhoto ? req.files.passportPhoto[0] : null;
    const certFile = req.files && req.files.certificates ? req.files.certificates[0] : null;

    if (passportFile) {
      try {
        const uploadRes = await uploadBuffer(passportFile.buffer, {
          folder: 'engineers/passports', // Changed folder
          transformation: [{ width: 500, height: 500, crop: 'fill' }],
          resource_type: 'image'
        });
        if (!uploadRes || !uploadRes.secure_url) throw new Error('Invalid response from Cloudinary');
        engineer.passportPhoto = uploadRes.secure_url; // Changed from doctor
        engineer.passportPhotoPublicId = uploadRes.public_id; // Changed from doctor
        console.log('Updated passportPhoto for engineer', id, uploadRes.public_id); // Changed from doctor
      } catch (err) {
        console.error('Passport photo upload error (profile update):', err);
        return res.status(500).json({ message: 'Failed to upload passport photo', error: err.message });
      }
    }

    if (certFile) {
      try {
        const uploadRes2 = await uploadBuffer(certFile.buffer, {
          folder: 'engineers/certificates', // Changed folder
          resource_type: 'auto',
          allowed_formats: ['pdf', 'png', 'jpg', 'jpeg']
        });
        if (!uploadRes2 || !uploadRes2.secure_url) throw new Error('Invalid response from Cloudinary');
        engineer.certificates = uploadRes2.secure_url; // Changed from doctor
        engineer.certificatesPublicId = uploadRes2.public_id; // Changed from doctor
        console.log('Updated certificates for engineer', id, uploadRes2.public_id); // Changed from doctor
      } catch (err) {
        console.error('Certificate upload error (profile update):', err);
        return res.status(500).json({ message: 'Failed to upload certificate', error: err.message });
      }
    }

    await engineer.save(); // Changed from doctor
    const obj = engineer.toObject(); // Changed from doctor
    delete obj.passwordHash;
    return res.json(obj);
  } catch (error) {
    console.error('Error in profile update:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
