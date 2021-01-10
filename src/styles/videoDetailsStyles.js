import styled from "styled-components";

export const VideoDetailsContainer = styled.div`
  width: 100%;
  background-color: #242731;
  text-align: left;
  padding-top: 4em;
  margin-top: -3em;
  border-radius: 32px;
`;

export const DetailHeadingBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 2em 3em 2em;

  img {
    height: 130px;
    width: 130px;
    margin: auto;

    @media only screen and (max-width: 1024px) {
      display: none;
    }
  }
`;

export const DetailsTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DetailsHeading = styled.h4`
  font-size: 30px;
`;

export const AlphaTag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 35px;
  width: 110px;
  text-align: center;
  background-color: #ff754c;
  border-radius: 8px;

  i {
    margin: auto 0;
  }

  span {
    margin: auto 0;
  }
`;
