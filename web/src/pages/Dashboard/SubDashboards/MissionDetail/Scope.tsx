import React from 'react';
import '../../Dashboard.scss';
import './MissionDetail.scss';
import * as AiIcons from 'react-icons/ai';

export default function Scope() {
    return (
        <table className="no_center_container">
            <tbody>
                <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Badges</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <td style={{ fontSize: '18px' }}>
                        <AiIcons.AiOutlineCheckCircle />
                    </td>
                    <td>https://evil.djnn.sh</td>
                    <td />
                    <td>
                        <input
                            type="button"
                            value="Edit"
                            className="borderBtn"
                        />
                        <AiIcons.AiFillDelete />
                        <AiIcons.AiFillEdit />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
