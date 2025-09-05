import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface VoterData {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  age?: number;
  gender?: string;
  voterId?: string;
  booth?: string;
  ward?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV or Excel files only.' },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    let data: any[] = [];

    if (file.type === 'text/csv') {
      // Handle CSV files
      const text = new TextDecoder().decode(buffer);
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return NextResponse.json(
          { error: 'File must contain at least a header row and one data row' },
          { status: 400 }
        );
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
    } else {
      // Handle Excel files
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No data found in the file' },
        { status: 400 }
      );
    }

    // Validate and transform data
    const voters: VoterData[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because we start from row 2 (after header)
      
      // Normalize column names (handle different naming conventions)
      const normalizedRow: any = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedRow[normalizedKey] = row[key];
      });

      // Required fields validation
      const requiredFields = ['name', 'phone', 'address', 'village', 'district', 'state', 'pincode'];
      const missingFields = requiredFields.filter(field => !normalizedRow[field] || normalizedRow[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        errors.push(`Row ${rowNumber}: Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Phone number validation
      const phone = normalizedRow.phone.toString().replace(/\D/g, '');
      if (phone.length !== 10) {
        errors.push(`Row ${rowNumber}: Invalid phone number format`);
        return;
      }

      // Email validation (if provided)
      if (normalizedRow.email && normalizedRow.email.toString().trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedRow.email.toString())) {
          errors.push(`Row ${rowNumber}: Invalid email format`);
          return;
        }
      }

      // Pincode validation
      const pincode = normalizedRow.pincode.toString().replace(/\D/g, '');
      if (pincode.length !== 6) {
        errors.push(`Row ${rowNumber}: Invalid pincode format (should be 6 digits)`);
        return;
      }

      // Create voter object
      const voter: VoterData = {
        name: normalizedRow.name.toString().trim(),
        phone: phone,
        whatsapp: normalizedRow.whatsapp ? normalizedRow.whatsapp.toString().replace(/\D/g, '') : undefined,
        email: normalizedRow.email && normalizedRow.email.toString().trim() !== '' ? normalizedRow.email.toString().trim() : undefined,
        address: normalizedRow.address.toString().trim(),
        village: normalizedRow.village.toString().trim(),
        district: normalizedRow.district.toString().trim(),
        state: normalizedRow.state.toString().trim(),
        pincode: pincode,
        age: normalizedRow.age ? parseInt(normalizedRow.age.toString()) : undefined,
        gender: normalizedRow.gender ? normalizedRow.gender.toString().trim() : undefined,
        voterId: normalizedRow.voterid ? normalizedRow.voterid.toString().trim() : undefined,
        booth: normalizedRow.booth ? normalizedRow.booth.toString().trim() : undefined,
        ward: normalizedRow.ward ? normalizedRow.ward.toString().trim() : undefined,
      };

      // Clean up empty optional fields
      Object.keys(voter).forEach(key => {
        if (voter[key as keyof VoterData] === '' || voter[key as keyof VoterData] === undefined) {
          delete voter[key as keyof VoterData];
        }
      });

      voters.push(voter);
    });

    // If there are validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Data validation failed',
          details: errors,
          validRecords: voters.length,
          totalRecords: data.length
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      voters: voters,
      totalRecords: voters.length,
      message: `Successfully processed ${voters.length} voter records`
    });

  } catch (error) {
    console.error('Error processing voter data file:', error);
    return NextResponse.json(
      { error: 'Failed to process file. Please check the file format and try again.' },
      { status: 500 }
    );
  }
}
