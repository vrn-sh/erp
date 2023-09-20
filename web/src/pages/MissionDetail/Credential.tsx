import React, { useEffect, useState } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IconButton, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import config from '../../config';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface Credential {
  id: number; // Ajout de l'ID pour identifier chaque credential
  service: string;
  login: string;
  password: string;
  comments: string;
  passwordVisible: boolean;
}

interface CredentialsProps {
  idMission: number; // Assurez-vous que idMission est de type number
}

export default function Credentials({ idMission }: CredentialsProps) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [newCredential, setNewCredential] = useState<Omit<Credential, 'id'>>({
    service: '',
    login: '',
    password: '',
    comments: '',
    passwordVisible: false,
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const role = Cookies.get('Role');

  const addCredential = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/credentials`,
        {
          login: newCredential.login,
          password: newCredential.password,
          service: newCredential.service,
          mission_id: idMission,
        },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Token ${Cookies.get('Token')}`,
          },
        }
      );

      const addedCredential = response.data;

      // Mettre à jour la liste des credentials avec la nouvelle credential ajoutée
      setCredentials((prevCredentials) => [
        ...prevCredentials,
        addedCredential,
      ]);

      // Réinitialiser le formulaire
      setNewCredential({
        service: '',
        login: '',
        password: '',
        comments: '',
        passwordVisible: false,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCredentialChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewCredential((prevCredential) => ({
      ...prevCredential,
      [event.target.name]: event.target.value,
    }));
  };

  const togglePasswordVisibility = (index: number) => {
    setCredentials((prevCredentials) =>
      prevCredentials.map((credential, i) => {
        if (i === index) {
          return {
            ...credential,
            passwordVisible: !credential.passwordVisible,
          };
        }
        return credential;
      })
    );
  };

  const fetchCredentials = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/credentials/?mission_id=${idMission}`, // Utilisation de la requête avec des paramètres de requête
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Token ${Cookies.get('Token')}`,
          },
        }
      );
      const data = response.data;
      setCredentials(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [idMission]);

  return (
    <>
      <div>
        <Button
          style={{
            backgroundColor: '#7c44f3',
            color: 'white',
            borderRadius: '5px',
            fontSize: '12px',
            marginLeft: '80%',
            marginBottom: '40px',
          }}
          onClick={() => setShowAddForm(true)}
        >
          Add Credentials
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Login</TableCell>
              <TableCell>Password</TableCell>
              <TableCell></TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{newCredential.service}</TableCell>
              <TableCell>{newCredential.login}</TableCell>
              <TableCell>
                {newCredential.passwordVisible
                  ? newCredential.password
                  : '********'}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() =>
                    setNewCredential((prevCredential) => ({
                      ...prevCredential,
                      passwordVisible: !prevCredential.passwordVisible,
                    }))
                  }
                >
                  {newCredential.passwordVisible ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </IconButton>
              </TableCell>
              <TableCell>{newCredential.comments}</TableCell>
            </TableRow>
            {credentials.map((credential, index) => (
              <TableRow key={credential.id}>
                <TableCell>{credential.service}</TableCell>
                <TableCell>{credential.login}</TableCell>
                <TableCell>
                  {credential.passwordVisible
                    ? credential.password
                    : '********'}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => togglePasswordVisibility(index)}
                  >
                    {credential.passwordVisible ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{credential.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showAddForm} onClose={() => setShowAddForm(false)}>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '26px', fontFamily: 'Poppins', }}>Add Credential</DialogTitle>
        <DialogContent style={{ display: 'grid' }}>
          {/* Les champs du formulaire pour ajouter un credential */}
          <TextField
            name="service"
            label="Service"
            value={newCredential.service}
            onChange={handleCredentialChange}
            required
            style={{ margin: '10px', width: '450px', overflowWrap: 'break-word' }}
          />
          <TextField
            name="login"
            label="Login"
            value={newCredential.login}
            onChange={handleCredentialChange}
            required
            style={{ margin: '10px', width: '450px', overflowWrap: 'break-word' }}
          />
          <TextField
            name="password"
            label="Password"
            type={newCredential.passwordVisible ? 'text' : 'password'}
            value={newCredential.password}
            onChange={handleCredentialChange}
            required
            style={{ margin: '10px', width: '450px', overflowWrap: 'break-word' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setNewCredential((prevCredential) => ({
                        ...prevCredential,
                        passwordVisible: !prevCredential.passwordVisible,
                      }))
                    }
                    edge="end"
                  >
                    {newCredential.passwordVisible ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="comments"
            label="Comments"
            value={newCredential.comments}
            style={{ margin: '10px', width: '450px', overflowWrap: 'break-word' }}
            onChange={handleCredentialChange}
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            style={{
              backgroundColor: '#7c44f3',
              color: 'white',
              borderRadius: '5px',
              fontSize: '12px',
              marginRight: '10px',
            }}
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: '#A687E9',
              color: 'white',
              borderRadius: '5px',
              fontSize: '12px',
            }}
            onClick={addCredential}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
