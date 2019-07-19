import React, { Component } from 'react';

export default class NoteErrorBoundary extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>Note could not be display.</div>
            );
        }
        return this.props.children;
    }
}