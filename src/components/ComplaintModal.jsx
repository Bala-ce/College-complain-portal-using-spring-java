// src/components/ComplaintModal.jsx
import React, { useState, useRef } from 'react';
import { X, Upload, Camera } from 'lucide-react';

export default function ComplaintModal({ departments, initialDept, onClose, onSubmit }) {
  const [dept, setDept] = useState(initialDept);
  const [hostelType, setHostelType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!dept || !subject || !description) return;
    if (dept === 'Hostel & Dining Services' && !hostelType) return;

    const finalDept = dept === 'Hostel & Dining Services'
      ? `${dept} (${hostelType})`
      : dept;

    onSubmit({ dept: finalDept, subject, description, file });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up sm:animate-fade-in relative">
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
              Attachment (Optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 border border-slate-300 border-dashed rounded-lg p-3 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Upload size={20} />
                <span className="text-sm">Upload Photo</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 border border-slate-300 border-dashed rounded-lg p-3 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Camera size={20} />
                <span className="text-sm">Take Photo</span>
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
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

            {file && (
              <p className="text-xs text-emerald-600 mt-2 truncate">
                Attached: {file.name}
              </p>
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
    </div>
  );
}
