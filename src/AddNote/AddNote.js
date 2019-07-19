import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ValidationError from '../Validation/ValidationError';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css';

export default class AddNote extends Component {

  constructor(props) {
        super(props);
        this.state = {
            newNoteName: '',
            newNoteNameValid: false,
            newNoteContent: '',
            newNoteContentValid: false,
            newNoteFolder: '',
            newNoteFolderValid: false,
            formValid: false,
            validationMessages: {
                noteName: '',
                noteContent: '',
                noteFolder: '',
            }
        }
    }

    static defaultProps = {
    history: {
      push: () => { }
    },
  }

  static getDerivedStateFromError(error) {
      return { hasError: true };
  }

  static contextType = ApiContext;

    formValid() {
        this.setState({
            formValid: this.state.newNoteNameValid &&
                       this.state.newNoteContentValid &&
                       this.state.newNoteFolderValid
        });
    }

    updateNewNoteName(newNoteName) {
        this.setState({ newNoteName }, () => {
            this.validateNoteName(newNoteName)
        });
    }

    validateNoteName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.noteName = 'Note Name is required';
            hasError = true;
        } else {
            if (fieldValue.length < 3) {
                fieldErrors.noteName = 'Note name must be at least 3 characters long';
                hasError = true;
            } else {
                fieldErrors.noteName = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            newNoteNameValid: !hasError
        }, this.formValid);
    }

    updateNewNoteContent(newNoteContent) {
        this.setState({ newNoteContent }, () => {
            this.validateNoteContent( newNoteContent )
        });
    }

    validateNoteContent(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.noteContent = 'Note Content is required';
            hasError = true;
        } else {
            if (fieldValue.length < 6) {
                fieldErrors.noteContent = 'Note Content must be at least 6 characters long';
                hasError = true;
            } else {
                fieldErrors.noteContent = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            newNoteContentValid: !hasError
        }, this.formValid);
    }

    updateNewNoteFolder(newNoteFolder) {
        this.setState({ newNoteFolder }, () => {
            this.validateFolder( newNoteFolder )
        });
    }

    validateFolder(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.noteFolder = 'Note Folder must be select';
            hasError = true;
        }else {
            if (fieldValue === '...') {
                fieldErrors.noteFolder = 'Note Folder must be select';
                hasError = true;
            } else {
                fieldErrors.noteFolder = '';
                hasError = false;
            }
        }
        this.setState({
            validationMessages: fieldErrors,
            newNoteFolderValid: !hasError
        }, this.formValid);
    }

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folderid: e.target['note-folder-id'].value,
      modified: new Date(),
    }

      const reqUrl =`${config.API_ENDPOINT}/notes`;

    fetch(reqUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folderid}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders=[] } = this.context
     return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name'
                   onChange={e => this.updateNewNoteName(e.target.value)}/>
              <ValidationError hasError={!this.state.newNoteNameValid}
                               message={this.state.validationMessages.noteName}/>
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content'
                      onChange={e => this.updateNewNoteContent(e.target.value)}/>
              <ValidationError hasError={!this.state.newNoteContentValid}
                               message={this.state.validationMessages.noteContent}/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id'
                    onChange={e => this.updateNewNoteFolder(e.target.value)}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
              <ValidationError hasError={!this.state.newNoteFolderValid}
                               message={this.state.validationMessages.noteFolder}/>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.formValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}


