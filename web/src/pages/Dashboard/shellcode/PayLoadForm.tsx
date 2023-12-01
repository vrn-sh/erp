import Modal from "react-modal";
import formRows from "../../../assets/strings/en/basicpayload.json";
import React, {useState} from "react";
import FormControl from "@mui/material/FormControl";
import {Box, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import BasicShellcode from "./BasicShellcode";
import MyPhShellcode from "./MyPhShellcode";

export default function PayLoadForm(props: {
    isModalOpen: boolean
    closeModal: any
}) {
    const [payloadType, setPayloadType] = useState("myph");

    const handleChange = (event: SelectChangeEvent) => {
        setPayloadType(event.target.value as string);
    };

    return (
        <form
            style={{
                display: props.isModalOpen ? 'block' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Modal
                isOpen={props.isModalOpen}
                onRequestClose={props.closeModal}
                contentLabel="General Payload Modal"
                style={{
                    content: {
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        maxWidth: '300em',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        overflow: 'hidden'
                    },
                }}
            >
                <h2 style={{
                        fontFamily: 'Poppins-Regular',
                    }}
                >Payload generation</h2>
                <InputLabel style={{
                    fontFamily: 'Poppins-Regular',
                    fontWeight: 900
                }}
                >ShellCode Type</InputLabel>
                <FormControl fullWidth style={{paddingBottom: "1em"}}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={payloadType}
                        onChange={handleChange}
                    >
                        <MenuItem value={"myph"}>MyPH</MenuItem>
                        <MenuItem value={"basicshellcode"}>Basic Shellcode</MenuItem>
                    </Select>
                </FormControl>
                <div style={{marginBottom: '1em'}}>
                    <h3 style={{
                        fontFamily: 'Poppins-Regular',
                        fontWeight: 900
                    }}>Configuration</h3>
                </div>
                {payloadType == "myph" && <MyPhShellcode closeModal={props.closeModal}/>}
                {payloadType == "basicshellcode" && <BasicShellcode closeModal={props.closeModal}/>}
            </Modal>
        </form>
    )
}