import React, { useState } from 'react';

interface NotificationSettings {
    push: boolean;
    ringtone: string;
    vibration: boolean;
    doNotDisturb: {
        start: number;
        end: number;
    };
    conversation: boolean;
    group: boolean;
    contact: boolean;
    showPreview: boolean;
}

const defaultSettings: NotificationSettings = {
    push: true,
    ringtone: 'default',
    vibration: true,
    doNotDisturb: {
        start: 22,
        end: 8,
    },
    conversation: true,
    group: true,
    contact: true,
    showPreview: true,
};

export default function SettingNotification() {
    const [settings, setSettings] =
        useState<NotificationSettings>(defaultSettings);

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        const value = event.target.checked;

        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleRingtoneChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { value } = event.target;

        setSettings((prevSettings) => ({
            ...prevSettings,
            ringtone: value,
        }));
    };

    const handleDoNotDisturbChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name } = event.target;
        const value = parseInt(event.target.value, 10);

        setSettings((prevSettings) => ({
            ...prevSettings,
            doNotDisturb: {
                ...prevSettings.doNotDisturb,
                [name]: value,
            },
        }));
    };

    const handleShowPreviewChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.checked;

        setSettings((prevSettings) => ({
            ...prevSettings,
            showPreview: value,
        }));
    };

    const handleReset = () => {
        setSettings(defaultSettings);
    };

    const handleSave = () => {
        // console.log(settings);
        // simulate saving settings to server or local storage
    };

    return (
        <div>
            <h1>Notification Settings</h1>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="push"
                        checked={settings.push}
                        onChange={handleToggle}
                    />
                    Push notifications
                </label>
            </div>
            <div>
                <label>
                    Ringtone:
                    <select
                        value={settings.ringtone}
                        onChange={handleRingtoneChange}
                    >
                        <option value="default">Default</option>
                        <option value="chimes">Chimes</option>
                        <option value="bell">Bell</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="vibration"
                        checked={settings.vibration}
                        onChange={handleToggle}
                    />
                    Vibration
                </label>
            </div>
            <div>
                <label>
                    Do not disturb:
                    <input
                        type="number"
                        name="start"
                        min={0}
                        max={23}
                        value={settings.doNotDisturb.start}
                        onChange={handleDoNotDisturbChange}
                    />
                    -
                    <input
                        type="number"
                        name="end"
                        min={0}
                        max={23}
                        value={settings.doNotDisturb.end}
                        onChange={handleDoNotDisturbChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="conversation"
                        checked={settings.conversation}
                        onChange={handleToggle}
                    />
                    Conversation
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="group"
                        checked={settings.group}
                        onChange={handleToggle}
                    />
                    Group
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="contact"
                        checked={settings.contact}
                        onChange={handleToggle}
                    />
                    Contact
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="showPreview"
                        checked={settings.showPreview}
                        onChange={handleShowPreviewChange}
                    />
                    Show message preview
                </label>
            </div>
            <div>
                <button type="button" onClick={handleReset}>
                    Reset
                </button>
                <button type="submit" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
}
