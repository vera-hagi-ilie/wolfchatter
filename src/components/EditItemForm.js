import React from "react"
import {Field, reduxForm} from "redux-form"
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux'
import {reset} from 'redux-form';

const renderField = ({ input, type, placeholder, meta: { touched, error } }) => (
	<div className="editable-item__input-validation">
		<input {...input} type={type} placeholder={placeholder}/>
		{touched && error && 
			<span className="editable-item__error">{error}</span>
		}
  	</div>
)


const EditItemForm = props => {
	const dispatch = useDispatch()
	
	const onSubmit = (formValues) =>{
		props.onInputSubmit(formValues["userInput"])
		dispatch(reset(props.form))
	}
	
	
	const nameText = props.name
  
	return (
		<form onSubmit={props.handleSubmit(onSubmit)}>
			<div className="editable-item__input">
				<label 
					for="userInput" 
					aria-label={`Input to edit ${props.name}`}
				> 
					{props.visibleLabel || ""}
				</label>

				<Field 
					name="userInput" 
					component={renderField}
					type="text" 
					placeholder={`Type a ${nameText}`}
					className="editable-item__input-validation"
				/>
			
			</div>
			
			
			<button 
				className="editable-item__edit" 
				aria-label={`Submit ${props.name}`}
			>
				<i className={props.submitIconClasses || "fa fa-arrow-circle-right"}></i>
			</button>
		</form>
  )
}

const validate = (formValues, props) => {
	const errors = {}
	
	if (!formValues.userInput){
		errors.userInput = ""
	}
	
	if (formValues.userInput && formValues.userInput.trim().length === 0){
		errors.userInput = "Input cannot be blank"
		
		console.log(formValues.userInput.trim().length)
	}
	
	if (formValues.userInput && props.customValidator){
		errors.userInput = props.customValidator(formValues.userInput.trim())
	}
	
	return errors
}


EditItemForm.propTypes = {
	name: PropTypes.string.isRequired,
	form: PropTypes.string.isRequired,
	submitIconClasses: PropTypes.string,
	visibleLabel: PropTypes.string,
	customValidator: PropTypes.func,
	onInputSubmit: PropTypes.func.isRequired
}


export default reduxForm({validate})(EditItemForm)
