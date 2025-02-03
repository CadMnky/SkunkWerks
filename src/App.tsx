import React, { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import { ParsedData, FeeScheduleEntry } from './types';
import { parseFileContent } from './utils/parseData';
import { getAvailableSchedules, readScheduleFile } from './utils/fileManager';
import { DataTable } from './components/DataTable';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedProc, setSelectedProc] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<FeeScheduleEntry | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [currentFileData, setCurrentFileData] = useState<FeeScheduleEntry[]>([]);
  const [availableProcs, setAvailableProcs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load available schedules on component mount
  useEffect(() => {
    const loadAvailableSchedules = async () => {
      try {
        const dates = await getAvailableSchedules();
        setAvailableDates(dates);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        setError('Failed to load available schedules');
        console.error('Load error:', err);
      }
    };

    loadAvailableSchedules();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setCurrentFileData([]);
      setAvailableProcs([]);
      return;
    }

    const loadFileData = async () => {
      setLoading(true);
      setError('');
      setSelectedEntry(null);
      try {
        const content = await readScheduleFile(selectedDate);
        const entries = parseFileContent(content);
        
        if (entries.length === 0) {
          throw new Error('No data found for the selected date');
        }
        
        setCurrentFileData(entries);
        setAvailableProcs([...new Set(entries.map(entry => entry.procCode))].sort());
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load fee schedule data';
        setError(errorMessage);
        console.error('Load error:', err);
        setCurrentFileData([]);
        setAvailableProcs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFileData();
  }, [selectedDate]);

  const handleSearch = () => {
    if (selectedDate && selectedProc) {
      const entry = currentFileData.find(entry => entry.procCode === selectedProc);
      setSelectedEntry(entry || null);
      if (!entry) {
        setError('No data found for the selected procedure code');
      } else {
        setError('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Fee Schedule Viewer</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedProc('');
                    setSelectedEntry(null);
                  }}
                >
                  <option value="">Select a date</option>
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PROC Code
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedProc}
                  onChange={(e) => {
                    setSelectedProc(e.target.value);
                    setSelectedEntry(null);
                  }}
                  disabled={!selectedDate || loading}
                >
                  <option value="">Select a PROC code</option>
                  {availableProcs.map(proc => (
                    <option key={proc} value={proc}>{proc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              disabled={!selectedDate || !selectedProc || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'View Details'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedEntry && <DataTable data={selectedEntry} />}
      </div>
    </div>
  );
}

export default App;