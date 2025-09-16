import { useState } from "react";
import { Save, Download, Upload, Trash2 } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'minimal',
    defaultView: 'daily',
    showCompleted: true,
    autoSave: true,
    reminderTime: '09:00',
    exportFormat: 'pdf',
  });

  const [isDataCleared, setIsDataCleared] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('tracker-settings', JSON.stringify(settings));
    // Show success feedback (in a real app, use toast)
    alert('Settings saved successfully!');
  };

  const exportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('tracker-tasks') || '[]'),
      habits: JSON.parse(localStorage.getItem('tracker-habits') || '[]'),
      notes: JSON.parse(localStorage.getItem('tracker-notes') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.tasks) localStorage.setItem('tracker-tasks', JSON.stringify(data.tasks));
        if (data.habits) localStorage.setItem('tracker-habits', JSON.stringify(data.habits));
        if (data.notes) localStorage.setItem('tracker-notes', JSON.stringify(data.notes));
        if (data.settings) setSettings(data.settings);

        alert('Data imported successfully! Please refresh the page to see changes.');
      } catch (error) {
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('tracker-tasks');
      localStorage.removeItem('tracker-habits');
      localStorage.removeItem('tracker-notes');
      localStorage.removeItem('tracker-settings');
      setIsDataCleared(true);
      setTimeout(() => setIsDataCleared(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your tracker experience</p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="border border-foreground bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Default Task View</label>
                <p className="text-xs text-muted-foreground">Choose the default view for tasks</p>
              </div>
              <select
                value={settings.defaultView}
                onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                className="border border-foreground bg-background px-3 py-1 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="all">All Tasks</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Show Completed Tasks</label>
                <p className="text-xs text-muted-foreground">Display completed tasks by default</p>
              </div>
              <button
                onClick={() => handleSettingChange('showCompleted', !settings.showCompleted)}
                className={`w-12 h-6 border border-foreground relative ${
                  settings.showCompleted ? 'bg-foreground' : 'bg-background'
                }`}
              >
                <div className={`w-4 h-4 bg-background border border-foreground absolute top-0.5 transition-transform ${
                  settings.showCompleted ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Save</label>
                <p className="text-xs text-muted-foreground">Automatically save changes</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                className={`w-12 h-6 border border-foreground relative ${
                  settings.autoSave ? 'bg-foreground' : 'bg-background'
                }`}
              >
                <div className={`w-4 h-4 bg-background border border-foreground absolute top-0.5 transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="border border-foreground bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Export Data</label>
                <p className="text-xs text-muted-foreground">Download a backup of all your data</p>
              </div>
              <button
                onClick={exportData}
                className="px-4 py-2 border border-foreground hover:bg-muted text-sm flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Import Data</label>
                <p className="text-xs text-muted-foreground">Restore data from a backup file</p>
              </div>
              <label className="px-4 py-2 border border-foreground hover:bg-muted text-sm flex items-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Clear All Data</label>
                <p className="text-xs text-muted-foreground">Remove all tasks, habits, and notes</p>
              </div>
              <button
                onClick={clearAllData}
                className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>

            {isDataCleared && (
              <div className="p-3 border border-foreground bg-muted text-sm">
                All data has been cleared. Refresh the page to see changes.
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="border border-foreground bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Version:</span> 1.0.0
            </p>
            <p>
              <span className="font-medium">Design:</span> Minimalist black & white interface inspired by GoodNotes
            </p>
            <p>
              <span className="font-medium">Features:</span> Task management, habit tracking, note-taking with paper-like aesthetics
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-foreground text-background hover:bg-muted-foreground flex items-center font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;