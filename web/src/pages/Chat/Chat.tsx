import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import config from '../../config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getCookiePart } from '../../crypto-utils';
import dayjs from 'dayjs';
import styles from './Chat.module.scss';
import { send } from 'vite';

function Chat({ teamId }: { teamId: number }) {
    const [messages, setMessages] = useState<{ message: string; timestamp: string; sender_info: string }[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [userInfos, setUserInfos] = useState({
        username: '',
        profileImage: '',
        first_name: '',
        last_name: '',
    });

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            url += 'freelancer';
        } else if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '2') {
            url += 'manager';
        } else {
            url += 'pentester';
        }
        const response = await axios.get(`${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
            },
        });

        const userData = response.data.auth;
        setUserInfos({
            username: userData.username,
            profileImage: userData.profile_image,
            first_name: userData.first_name,
            last_name: userData.last_name,
        });
    };

    useEffect(() => {
        getUserInfos();
        const pusher = new Pusher('8704037a23dad6569f48', {
            cluster: 'eu',
        });

        const channel = pusher.subscribe('chat-channel');

        channel.bind('chat-event', (data: { message: string; timestamp: string }) => {
            const newMessage = { message: data.message, timestamp: data.timestamp };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        fetchMessagesFromBackend(teamId);
        const interval = setInterval(() => {
          fetchMessagesFromBackend(teamId);
        }, 1000);

        return () => {
          clearInterval(interval); // Cleanup on component unmount
          if(pusher) {
            pusher.unsubscribe('chat-channel');
          }
        };
      }, [teamId]);

    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      if (messageInput.trim() !== '') {
            sendMessageToBackend(messageInput, userInfos.username, teamId);
            setMessageInput('');
        }
    };

    const sendMessageToBackend = async (message: string, senderId: string, teamId: number) => {
      try {
            await axios.post('http://127.0.0.1:8000/pusher', {
                message,
                senderId,
                team_id: teamId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('Token')}`,
                },
            });
        } catch (error) {
            console.error('Error sending message to backend:', error);
        }
    };

    const fetchMessagesFromBackend = async (teamId: number) => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/messages/search_by_team/?team_id=${teamId}`, {
              headers: {
                  Authorization: `Bearer ${Cookies.get('Token')}`,
              },
          });
            if (response.status === 200) {
                setMessages(response.data || []);
            } else {
                console.error('Failed to fetch messages from backend');
            }
        } catch (error) {
            console.error('Error fetching messages from backend:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messages}>
                {messages && messages.map((message, index) => (
                  <div key={index} className={`${styles.message} ${message.sender_info === userInfos.username ? styles.ownMessage : ''}`}>
                    <span><strong>{message.sender_info}:</strong> {message.message} - {dayjs(message.timestamp).format('YYYY-MM-DD HH:mm')}</span>
                  </div>
                ))}
            </div>
            <form onSubmit={handleMessageSubmit} className={styles.form}>
                <input
                    type="text"
                    value={messageInput}
                    onChange={handleChange}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chat;
