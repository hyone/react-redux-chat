import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

@reduxForm({
  form: 'compose-message',
  fields: ['text']
})
export default class MessageForm extends Component {
  static propTypes = {
    // redux-form
    fields: PropTypes.shape({
      text: PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    // actions
    submitAction: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);
  }

  render() {
    const {
      fields: { text },
      handleSubmit
    } = this.props;

    return (
      <form className="message-form" onSubmit={ handleSubmit(this.submit) }>
        <div className="input-group">
          <input
            type="text"
            name="text"
            className="form-control input-sm message-text"
            ref="text"
            placeholder="Type your message"
            autoComplete="off"
            autoFocus
            { ...text } />
          <div className="input-group-btn">
            <button
              type="submit"
              className="btn btn-primary input-sm"
              disabled={ !text.value || text.value.trim() === "" }>
                Post
            </button>
          </div>
        </div>
      </form>
    )
  }

  submit() {
    const { resetForm, submitAction, fields: { text } } = this.props;
    submitAction(text.value);
    resetForm();
  }
}
