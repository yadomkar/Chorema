import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import bucketImage from '../../icons/images/bucket.png';
import trashImage from '../../icons/images/trash-cans.png';
import dishesImage from '../../icons/images/spray.png';
import noteImage from '../../icons/images/note.png';
import houseImage from '../../icons/images/house.png';
import stickerImage from '../../icons/images/sticker.png';


import "./Landing.css";

import * as React from "react";

const LandingPage = () => {
  return (
    <Container sx={{ py: "4vh" }} maxWidth="sm">
      <div className="headlineContain">
        <div className="iconBox">
          <div className="iconContain">
            <img
              className="choreIcon"
              alt="Bucket and mop icon"
              src={bucketImage}
            />
          </div>
          <div className="iconContain">
            <img
              className="choreIcon"
              alt="Trash and recycling bins icon"
              src={trashImage}
            />
          </div>
          <div className="iconContain">
            <img
              className="choreIcon"
              alt="Dish soap and dishes icon"
              src={dishesImage}
            />
          </div>
        </div>
        <div className="question">Who does the most chores in your house?</div>
      </div>
      <div className="dashboardButtonContainer">
        <Link to="/dashboard" className="dashboardButton">
          Go to Dashboard
        </Link>
      </div>

      <section className="explainSection">
        <div className="explainBlock">
          <div className="explainIconContain">
            <img
              className="explainIcon"
              alt="Note pad icon"
              src={noteImage}
            />
          </div>
          <div className="explainContent">
            <b>Chorema is an easy peasy</b> chore chart that makes a friendly
            competition out of keeping shared spaces tidy. Because life's too
            short to waste time bickering over who cleaned the sink trap last.
          </div>
        </div>
        <div className="explainBlock">
          <div className="explainIconContain">
            <img
              className="explainIcon"
              alt="House icon"
              src={houseImage}
            />
          </div>
          <div className="explainContent">
            <b>Get started in a flash!</b> Just create an account for your
            household. With a few taps or clicks, you can set up a leaderboard
            for your household members and create a weekly chore list.
          </div>
        </div>
        <div className="explainBlock">
          <div className="explainIconContain">
            <img
              className="explainIcon"
              alt="Star sticker icon"
              src={stickerImage}
            />
          </div>
          <div className="explainContent">
            <b>Assign point values to chores</b> & choose how many times they
            should be done each week. Then check off chores as you complete them
            to score points. No more tantrums & passive aggressive notes!
          </div>
        </div>
      </section>
    </Container>
  );
};

export default LandingPage;

LandingPage.displayName = "LandingPage";
