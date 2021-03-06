import React, {Component, PropTypes} from 'react';
import {Subject} from 'rxjs';
import makeAction from '../../lib/makeAction';
import ChildActions from '../../high-component/ChildActions';
import {RemovableTag, RemovableTagActions} from '../RemovableTag';
import {UPDATE_TAGS} from './actionTypes';
import './style.scss';

const Actions = new Subject();

@ChildActions(RemovableTagActions)
class EditableTagsRow extends Component {
    static propTypes = {
        tags: PropTypes.arrayOf(PropTypes.string).isRequired
    };

    static handleChildActions = (props, childActions) => childActions
        .filter(({type}) => type === 'REMOVE_TAG')
        .do(({tag}) => {
            const remainingTags = props.tags.filter((oldTag) => oldTag !== tag);

            Actions.next(makeAction(UPDATE_TAGS, {tags: remainingTags}));
        });

    handleKeyUp = (event) => {
        const tags = this.props.tags;
        const keyCode = event.keyCode;
        const isNewTag = (newTag) => tags.map((t) => t.toLowerCase())
                                         .indexOf(newTag) === -1;
        const newTags = event.target.value
                             .toLowerCase()
                             .split(',')
                             .map((tag) => tag.trim())
                             .filter((tag) => Boolean(tag)) // remove empty values
                             .filter((tag, index, self) => self.indexOf(tag) === index) // remove duplicates
                             .filter(isNewTag)
                             .concat(tags);

        if (keyCode === 13) {
            Actions.next(makeAction(UPDATE_TAGS, {tags: newTags}));
        }

        if (keyCode === 13 || keyCode === 27) {
            event.target.value = '';
            event.target.blur();
        }
    };

    render () {
        const tags = this.props.tags;

        return (
            <div className='TagsRow__container'>
                {tags.map((tag) => <RemovableTag key={tag} value={tag} />)}

                <input
                    className='TagsRow-new-tag-input'
                    onKeyUp={this.handleKeyUp}
                    placeholder='Add tag'
                />
            </div>
        );
    }
}

const EditableTagsRowActions = Actions;

export {
    EditableTagsRow,
    EditableTagsRowActions
};
