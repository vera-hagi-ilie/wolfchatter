import React, {useState} from "react"
import onClickOutside from "react-onclickoutside"
import PropTypes from 'prop-types';
import EditItemForm from "./EditItemForm"


const EditableItem = props => {
  	const [isOpen, setIsOpen] = useState(props.open || false)
	
	const open = () => setIsOpen(true)
	const close = () => setIsOpen(false)
	const reset = () => setIsOpen(props.open || false)
	
	const handleInputSubmit	= (input) => {	
		if (input && input.trim()){
			props.onSubmitRequest(input.slice(0, props.maxlength || 20))
			if (!props.alwaysOpen ){
				close()
			}
		}else{
			if (!props.open){
				close()
			}
		}
			
	}

  	EditableItem['handleClickOutside_' + props.name] = reset
	

	return (
		<div className="editable-item">
			{(!isOpen) &&
			<>
				{props.visibleLabel && 
					<label 
						for={props.name} 
						className="editable-item__label">
							{props.visibleLabel}
					</label>
				}
				<h3 name={props.name} 
					className="editable-item__title"
				>
				 	{props.title}
			 	</h3>
				<button 
					className="editable-item__edit" 
					aria-label={`Edit ${props.name}`}
					onClick={open}
				>
					<i class={props.editIconClasses || "fa fa-pencil-alt" }></i>
				</button>
			</>
			}
			{isOpen &&
			<>
				<EditItemForm form={props.form} 
					          name={props.name} 
					          submitIconClasses={props.submitIconClasses}
							  customValidator={props.customValidator}	
							  onInputSubmit={handleInputSubmit}/>
			</>
			}
		</div>
  )
}

const clickOutsideConfig = {
  handleClickOutside: ({ props }) => EditableItem['handleClickOutside_' + props.name]
};


EditableItem.propTypes = {
	name: PropTypes.string.isRequired,
	form: PropTypes.string.isRequired,
	title: PropTypes.string,
	editIconClasses: PropTypes.string,
	submitIconClasses: PropTypes.string,
	open: PropTypes.bool,
	alwaysOpen: PropTypes.bool,
	maxlength:PropTypes.number,
	visibleLabel: PropTypes.string,
	customValidator: PropTypes.func,
	onSubmitRequest: PropTypes.func.isRequired
}


export default onClickOutside(EditableItem, clickOutsideConfig)
