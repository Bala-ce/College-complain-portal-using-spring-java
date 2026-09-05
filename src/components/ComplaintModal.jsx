// src/components/ComplaintModal.jsx
import React, { useState, useRef } from 'react';
import { X, Upload, Camera } from 'lucide-react';

export default function ComplaintModal({ departments, initialDept, onClose, onSubmit }) {
  const [dept, setDept] = useState(initialDept);
  const [hostelType, setHostelType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [busNumber, setBusNumber] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const newFiles = [...prev, ...selectedFiles];
        return newFiles.slice(0, 3); // Limit to 3 files
      });
    }
    e.target.value = ''; // Reset input so same file can be selected again
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const submitForm = async (e) => {
    e.preventDefault();
    if (!dept || !subject || !description) return;
    if (dept === 'Hostel & Dining Services' && !hostelType) return;

    let finalDept = dept;
    if (dept === 'Hostel & Dining Services' && hostelType) {
      finalDept = `${dept} (${hostelType})`;
    } else if (dept === 'Transport & Bus Fleet' && busNumber) {
      finalDept = `${dept} (Bus: ${busNumber})`;
    }

    let imageData = null;
    if (files.length > 0) {
      imageData = await toBase64(files[0]);
    }

    onSubmit({ dept: finalDept, subject, description, imageData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up sm:animate-fade-in relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Raise Complaint</h2>

        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="" disabled>Select a department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {dept === 'Hostel & Dining Services' && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hostel Type
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer p-2 bg-white rounded border border-slate-200 hover:border-emerald-500 transition-colors">
                  <input
                    type="radio"
                    name="hostelType"
                    value="Ladies Hostel"
                    checked={hostelType === 'Ladies Hostel'}
                    onChange={(e) => setHostelType(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  Ladies Hostel
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer p-2 bg-white rounded border border-slate-200 hover:border-emerald-500 transition-colors">
                  <input
                    type="radio"
                    name="hostelType"
                    value="Gents Hostel"
                    checked={hostelType === 'Gents Hostel'}
                    onChange={(e) => setHostelType(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  Gents Hostel
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer p-2 bg-white rounded border border-slate-200 hover:border-emerald-500 transition-colors">
                  <input
                    type="radio"
                    name="hostelType"
                    value="NRI Hostel"
                    checked={hostelType === 'NRI Hostel'}
                    onChange={(e) => setHostelType(e.target.value)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  NRI Hostel
                </label>
              </div>
            </div>
          )}

          {dept === 'Transport & Bus Fleet' && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bus Number (Optional)
              </label>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="e.g. 12 or MH-12-AB-1234"
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Brief subject of complaint"
              className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              placeholder="Describe your issue in detail..."
              className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Attachment (Max 3, Optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={files.length >= 3}
                onClick={() => galleryInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center gap-2 border border-slate-300 border-dashed rounded-lg p-3 transition-colors ${files.length >= 3 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Upload size={20} />
                <span className="text-sm">Upload Photo</span>
              </button>
              <button
                type="button"
                disabled={files.length >= 3}
                onClick={() => cameraInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center gap-2 border border-slate-300 border-dashed rounded-lg p-3 transition-colors ${files.length >= 3 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Camera size={20} />
                <span className="text-sm">Take Photo</span>
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={galleryInputRef}
              onChange={handleFileChange}
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={cameraInputRef}
              onChange={handleFileChange}
            />

            {files.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-600 mb-2">
                  Attached ({files.length}/3):
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {files.map((f, index) => (
                    <div 
                      key={index}
                      className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity group"
                    >
                      <img 
                        src={URL.createObjectURL(f)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onClick={() => setPreviewFile(f)}
                      />
                      <div 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      >
                        <span className="text-white text-xs font-medium">View</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-medium rounded-lg py-3 hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            Submit Complaint
          </button>
        </form>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setPreviewFile(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
          >
            <X size={32} />
          </button>
          <img 
            src={URL.createObjectURL(previewFile)} 
            alt="Full Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
