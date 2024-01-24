import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import avat from '../MUI/avatar.jpg'
import Rating from '@mui/material/Rating';
import MainModal from './Modal';

export default function ShowReviews(props) {
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalDetails, setModalDetails] = useState({});
    const renderBackdrop = (props) => <div className="backdrop" {...props} />;

    var handleClose = () => setShowModal(false);

    var handleSuccess = () => {
    console.log("success");
  };

    useEffect(() => {
        axios
            .get("http://localhost:3001/getreviews")
            .then((res) => {
                console.log(res.data.message);
                setReviews(res.data.message);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleClick(review) {
        setModalDetails(review)
        setShowModal(true)
    }
    return (
        <div style={{
            height: '50vh',
            width: '50vh',
            overflowY: "scroll",
            display: 'flex',
            justifyContent: 'center',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius:"10px", backgroundColor: "transparent", maxWidth: "40vh", }}>
            {reviews.map((review) => {
                return (
                    <ListItem
                        alignItems="flex-start"
                        key={review._id}
                        onClick={() => handleClick(review)}
                        className="review_item"
                        style={{
                            backgroundColor: "#2b4162",
                            backgroundImage: "linear-gradient(315deg, #2b4162 0%, #12100e 74%)",
                            color: "white",
                            borderRadius: "7px",
                            margin: "8px",
                            transition: "background-color 0.3s ease",
                        }}
                        sx={{
                            "&:hover": {
                                backgroundColor: "#1a2c42",
                            },
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar alt="avatar" src={avat} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={review.review}
                            secondary={
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Rating name="read-only" value={review.rating} readOnly color="white" />
                                </div>
                            }
                        />
                    </ListItem>
                );
            })}
        </List>
        <MainModal showModal={showModal} setShowModal={setShowModal} renderBackdrop={renderBackdrop} handleClose={handleClose} handleSuccess={handleSuccess} review={modalDetails} />
        </div>
    );
}