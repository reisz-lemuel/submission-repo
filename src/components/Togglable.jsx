import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)
  
  const hideVisibility = {display : visible ? 'none' : ''}
  const showVisibility = {display : visible ? '' : 'none'}

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(refs, () => {
    return{
      toggleVisibility
    }
  })
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }
  return (
    <div>
      <div style={hideVisibility}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showVisibility}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
export default Togglable