import React, { useState } from 'react';
import axios from 'axios';
import './Survey.scss';
import config from '../../../config';

const SurveyPage: React.FC = () => {
    const [formData, setFormData] = useState({
        occupation: '',
        rating: '',
        experience: '',
        source: '',
        feedback: ''
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [responseColor, setResponseColor] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track if form is successfully submitted

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isSubmitting) {
            setIsSubmitting(true);
            try {
                const response = await axios.post(`${config.apiUrl}/survey-responses`, formData);
                console.log('Survey response submitted successfully:', response.data);
                setResponseMessage('Survey response submitted successfully');
                setResponseColor('green');
                setIsSubmitted(true); // Set form submitted state to true
            } catch (error) {
                console.error('Error submitting survey response:', error);
                setResponseMessage('Error submitting survey response');
                setResponseColor('red');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="voron-feedback-survey-container">
            <h1>Voron's Anonymous Feedback Survey</h1>
            <form onSubmit={handleSubmit}>
                <div className="voron-feedback-survey-question">
                    <label>Who are you?</label>
                    <div className="voron-feedback-survey-checkbox-options">
                        <label htmlFor="pentester"><input type="radio" id="pentester" name="occupation" value="Pentester" onChange={handleInputChange} required /> Pentester</label>
                        <label htmlFor="manager"><input type="radio" id="manager" name="occupation" value="Manager" onChange={handleInputChange} required /> Manager</label>
                        <label htmlFor="other"><input type="radio" id="other" name="occupation" value="Other" onChange={handleInputChange} required /> Other</label>
                    </div>
                </div>
                <div className="voron-feedback-survey-question">
                    <label>How would you rate your overall experience?</label>
                    <div className="voron-feedback-survey-checkbox-options">
                        <label htmlFor="rating1"><input type="radio" id="rating1" name="rating" value="1" onChange={handleInputChange} required /> 1</label>
                        <label htmlFor="rating2"><input type="radio" id="rating2" name="rating" value="2" onChange={handleInputChange} required /> 2</label>
                        <label htmlFor="rating3"><input type="radio" id="rating3" name="rating" value="3" onChange={handleInputChange} required /> 3</label>
                        <label htmlFor="rating4"><input type="radio" id="rating4" name="rating" value="4" onChange={handleInputChange} required /> 4</label>
                        <label htmlFor="rating5"><input type="radio" id="rating5" name="rating" value="5" onChange={handleInputChange} required /> 5</label>
                    </div>
                </div>
                <div className="voron-feedback-survey-question">
                    <label>How long have you been using voron ?</label>
                    <div className="voron-feedback-survey-checkbox-options">
                        <label htmlFor="option1"><input type="radio" id="option1" name="experience" value="<1 Month" onChange={handleInputChange} required /> &lt;1 Month</label>
                        <label htmlFor="option2"><input type="radio" id="option2" name="experience" value="1-6 Months" onChange={handleInputChange} required /> 1-6 Months</label>
                        <label htmlFor="option3"><input type="radio" id="option3" name="experience" value="6-12 Months" onChange={handleInputChange} required /> 6-12 Months</label>
                        <label htmlFor="option4"><input type="radio" id="option4" name="experience" value="12-24 Months" onChange={handleInputChange} required /> 12-24 Months</label>
                        <label htmlFor="option5"><input type="radio" id="option5" name="experience" value=">24 Months" onChange={handleInputChange} required /> &gt;24 Months</label>
                    </div>
                </div>
                <div className="voron-feedback-survey-question">
                    <label>How did you hear about us?</label>
                    <div className="voron-feedback-survey-checkbox-options">
                        <label htmlFor="source1"><input type="radio" id="source1" name="source" value="Google" onChange={handleInputChange} required /> Google</label>
                        <label htmlFor="source2"><input type="radio" id="source2" name="source" value="Indeed" onChange={handleInputChange} required /> Indeed</label>
                        <label htmlFor="source3"><input type="radio" id="source3" name="source" value="Coworker" onChange={handleInputChange} required /> Coworker</label>
                        <label htmlFor="source4"><input type="radio" id="source4" name="source" value="Friend" onChange={handleInputChange} required /> Friend</label>
                        <label htmlFor="source5"><input type="radio" id="source5" name="source" value="Other" onChange={handleInputChange} required /> Other</label>
                    </div>
                </div>
                <div className="voron-feedback-survey-question">
                    <label htmlFor="feedback">Any additional feedback:</label>
                    <textarea id="feedback" name="feedback" rows={4} onChange={handleInputChange} required></textarea>
                </div>
                <div className="voron-feedback-survey-response" style={{ color: responseColor }}>
                    {responseMessage}
                </div>
                <div className="voron-feedback-survey-button-container">
                    {!isSubmitting && !isSubmitted && (
                        <button type="submit" className="voron-feedback-survey-participate-button">
                            Submit
                        </button>
                    )}
                    {isSubmitting && !isSubmitted && (
                        <button type="button" className="voron-feedback-survey-participate-button">
                            Submitting...
                        </button>
                    )}
                    {isSubmitted && (
                        <button type="button" className="voron-feedback-survey-participate-button" style={{ visibility: 'hidden' }}>
                            Submitted
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SurveyPage;
