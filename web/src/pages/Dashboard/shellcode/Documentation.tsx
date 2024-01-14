import React from 'react';
import GIF from '../../../assets/BasicShellcode.gif';

export function MyPhDocumentationContent() {
    return (
        <>
            <h2>Documentation MyPh Shellcode</h2>

            <div>
                <h3>Server Overview</h3>
                <p>
                    The server is an entry point for handling various routes
                    related to MyPh shellcode operations. It uses FastAPI, a
                    modern, fast web framework for building APIs with Python.
                    CORS is enabled for all origins.
                </p>
            </div>

            <h3>Usage</h3>
            <div>
                <img src={GIF} alt="Generate MyPh payload demonstration" />
            </div>
        </>
    );
}

export function BasicShellcodeDocumentationContent() {
    return (
        <>
            <h2>Documentation Basic Shellcode</h2>

            <div>
                <h3>Server Overview</h3>
                <p>
                    The server is an entry point for handling various routes
                    related to shellcode operations. It uses FastAPI, a modern,
                    fast web framework for building APIs with Python. CORS is
                    enabled for all origins.
                </p>
                <h3>Endpoints</h3>
                <ul>
                    <li>
                        <strong>GET /</strong>
                        <p>
                            Description: Basic root route that returns a simple
                            greeting.
                        </p>
                        <p>Response: Returns a JSON object Hello: World</p>
                    </li>
                    <li>
                        <strong>POST /load_shellcode</strong>
                        <p>
                            Description: Main route to get a simple shellcode.
                            This endpoint generates a payload based on the
                            provided parameters, allowing for custom shellcode
                            creation.
                        </p>
                        <p>
                            Parameters:
                            <ul>
                                <li>
                                    lport (int): Listening callback port for a
                                    reverse-shell (default: 4444).
                                </li>
                                <li>
                                    laddr (str): Listening callback address for
                                    a reverse-shell (default: '10.0.2.2').
                                </li>
                                <li>
                                    exploit (str): The type of metasploit
                                    shellcode to embed in your loader (default:
                                    'x64/shell_reverse_tcp').
                                </li>
                                <li>
                                    arch (str): Target architecture of the
                                    system (default: 'x64').
                                </li>
                                <li>
                                    os (str): Target operating system of the
                                    system (default: 'windows').
                                </li>
                                <li>
                                    output_type (str): Output type of the
                                    compiled shellcode (default: 'exe').
                                </li>
                                <li>
                                    method (str): Loader method (options:
                                    'CreateRemoteThread', 'processHollowing').
                                </li>
                                <li>
                                    exit_func (Optional[str]): Metasploit
                                    shellcode EXITFUNC parameter.
                                </li>
                                <li>
                                    encoder (Optional[str]): Metasploit
                                    shellcode --encoder parameter.
                                </li>
                                <li>
                                    exclude_bytes (Optional[str]): Metasploit
                                    shellcode -b parameter.
                                </li>
                                <li>
                                    entropy (Optional[str]): Method for entropy
                                    reduction (default: Empty).
                                </li>
                            </ul>
                        </p>
                        <p>
                            Response: Success - Returns a file response with the
                            generated executable. Failure - Returns an error
                            message in JSON format.
                        </p>
                    </li>
                    <li>
                        <strong>POST /v2/load_myph</strong>
                        <p>
                            Description: This route allows uploading and
                            processing a shellcode file with specified
                            encryption and technique.
                        </p>
                        <p>
                            Parameters:
                            <ul>
                                <li>
                                    shellcode_file (UploadFile): The file
                                    containing the shellcode.
                                </li>
                                <li>
                                    technique (str): The technique used for
                                    shellcode execution (default:
                                    'ProcessHollowing').
                                </li>
                                <li>
                                    encryption (str): Type of encryption to be
                                    applied to the shellcode (default:
                                    'chacha20').
                                </li>
                            </ul>
                        </p>
                        <p>
                            Response: Returns a file response with the processed
                            executable.
                        </p>
                    </li>
                </ul>
                <h3>Additional Notes</h3>
                <p>
                    The server relies on external dependencies like MinGW and
                    uses subprocess calls for certain operations. Error handling
                    is implemented in the /load_shellcode route, with checks for
                    payload validity and MinGW installation.
                </p>
                <h3>Usage</h3>
                <div>
                    <img src={GIF} alt="Generate payload demonstration" />
                </div>
            </div>
        </>
    );
}
