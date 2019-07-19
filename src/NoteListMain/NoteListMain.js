import React from 'react'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import NoteErrorBoundary from "../ErrorBoundary/NoteErrorBoundary";
import {getNotesForFolder} from '../notes-helpers'
import './NoteListMain.css'

export default class NoteListMain extends React.Component {
    static defaultProps = {
        match: {
            params: {}
        }
    }
    static contextType = ApiContext

    render() {
        const {folderid} = this.props.match.params
        const notes = this.context.notes
        const notesForFolder = getNotesForFolder(notes, folderid)
        return (
        <section className='NoteListMain'>
            <ul>
                {notesForFolder.map(note =>
                    <li key={note.id}>
                        <NoteErrorBoundary>
                        <Note
                            id={note.id}
                            name={note.name}
                            modified={note.modified}
                        />
                        </NoteErrorBoundary>
                    </li>
                )}
            </ul>
            <div className='NoteListMain__button-container'>
                <CircleButton
                    tag={Link}
                    to='/add-note'
                    type='button'
                    className='NoteListMain__add-note-button'
                >
                    <FontAwesomeIcon icon='plus'/>
                    <br/>
                    Note
                </CircleButton>
            </div>
        </section>
        )
    }
}
