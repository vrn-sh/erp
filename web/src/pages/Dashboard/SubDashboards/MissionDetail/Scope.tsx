import React from 'react';
import '../../Dashboard.scss';
import './MissionDetail.scss';

export default function Scope() {
    return (
        <table className="no_center_container">
            <tbody>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>
                        <input type="button" value="Open" className="openBtn" />
                        <input
                            type="button"
                            value="Edit"
                            className="borderBtn"
                        />
                    </td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>
    );
}
