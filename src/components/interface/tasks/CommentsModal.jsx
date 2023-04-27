import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import callAPI from "../callAPI";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function CommentsModal(props) {
    const [show, setShow] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const getComments = () => {
        callAPI('GET', `/api/task/comments/${props.task_id}`, {}, props.setLoading)
            .then((result) => {
                result.task_comments.sort((a, b) => {
                    return new Date(b.comment_date) - new Date(a.comment_date);
                });

                setComments(result.task_comments);
            })
            .catch(props.handleError);
    }

    const handleClose = () => setShow(false);
    const handleShow = () => {
        if (comments.length === 0) {
            getComments();
        }

        setShow(true);
    };
    const handlePostComment = e => {
        e.preventDefault();

        if (comment.trim() === '') {
            props.handleError({
                message: 'Invalid comment',
                response: {
                    data: {
                        message: 'Comment cannot be empty'
                    }
                }
            });
            return;
        }

        callAPI('POST', '/api/task/comment', {
            task_id: props.task_id,
            comment_text: comment
        }, props.setLoading)
            .then((result) => {
                getComments();
                setComment('');
            })
            .catch(props.handleError);
    }
    const handleRemoveComment = comment_id => {
        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        callAPI('DELETE', `/api/task/comment/${comment_id}/${cookies.get('USER_ID')}`, {}, props.setLoading)
            .then((result) => {
                getComments();
            })
            .catch(props.handleError);
    }

    const canDeleteComment = comment_user_id => {
        const projectMember = props.projectMembers.find(pm => pm.user_id === comment_user_id);

        if (projectMember !== undefined) {
            return comment_user_id === parseInt(cookies.get('USER_ID'))
                || (props.isAdmin && !projectMember.is_owner);
        } else {
            return true;
        }
    }

    return (
        <>
            <Button
                variant="info"
                size="sm"
                onClick={handleShow}
            >
                View
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: '50vh',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column-reverse'
                    }}
                >
                    {
                        comments.length > 0
                            ? comments.map(comment => (
                                <div
                                    key={comment.comment_id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                        borderBottom: '1px solid #ccc',
                                        paddingBottom: '10px'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{comment.username}</div>
                                        <div>{comment.comment_text}</div>
                                        <div style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                            {new Date(comment.comment_date).toLocaleString()}
                                        </div>
                                    </div>
                                    {
                                        canDeleteComment(comment.user_id)
                                            ? <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveComment(comment.comment_id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                            : <></>
                                    }
                                </div>
                            ))
                            : <div>No comments</div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Form onSubmit={handlePostComment} style={{ width: '100%' }}>
                        <Form.Group controlId="comment">
                            <Form.Control
                                as="textarea"
                                style={{ height: '100px' }}
                                placeholder="Write a comment"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />

                            <Button
                                disabled={comment.trim() === ''}
                                variant="primary"
                                type="submit"
                                style={{ marginTop: '10px', float: 'right' }}
                            >
                                Post
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CommentsModal;
