import React, {Component} from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ValidationError from '../Validation/ValidationError';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';

export default class AddFolder extends Component {
    static defaultProps = {
        history: {
            push: () => {
            }
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            newFolderName: '',
            newFolderNameValid: false,
            formValid: false,
            validationMessages: {
                folderName: '',
            }
        }
    }

    static contextType = ApiContext;

    updateNewFolderName(newFolderName) {
        this.setState({ newFolderName }, () => {
            this.validateFolderName(newFolderName)
        });
    }

    formValid() {
        this.setState({
            formValid: this.state.newFolderNameValid
        });
    }

    validateFolderName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.name = 'Folder Name is required';
            hasError = true;
        } else {
            if (fieldValue.length < 3) {
                fieldErrors.name = 'Name must be at least 3 characters long';
                hasError = true;
            } else {
                fieldErrors.name = '';
                hasError = false;
            }
        }

        this.setState({
            validationMessages: fieldErrors,
            newFolderNameValid: !hasError
        }, this.formValid);
    }

    handleSubmit = e => {
        e.preventDefault()
        const folder = {
            name: e.target['folder-name'].value
        }
        const reqUrl =`${config.API_ENDPOINT}/folders`;

        fetch(reqUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            },
            body: JSON.stringify(folder),
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(folder => {
                this.context.addFolder(folder)
                this.props.history.push(`/folder/${folder.id}`)
            })
            .catch(error => {
                console.error({error})
            })
    }

    render() {
        return (
            <section className='AddFolder'>
                <h2>Create a folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                        </label>
                        <input type='text' id='folder-name-input' name='folder-name'
                               onChange={e => this.updateNewFolderName(e.target.value)}/>
                        <ValidationError hasError={!this.state.newFolderNameValid}
                                         message={this.state.validationMessages.name}/>
                    </div>
                    <div className='buttons'>
                        <button type='submit' disabled={!this.state.formValid}>
                            Add folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}
