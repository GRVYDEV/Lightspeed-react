import styled from "styled-components";

export const MainContainer = styled.div`
  padding-left: 3.5rem;
  padding-right: 3.5rem;
  padding-bottom: 3.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 1.5rem;

  @media only screen and (max-width: 1170px) {
    padding-left: 3.5rem;
    padding-right: 3.5rem;
    padding-bottom: 3.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 1.5rem;
  }
`;

export const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 60%;
  color: #fff;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  @media only screen and (max-width: 1170px) {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    color: #fff;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-bottom: 4rem;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const VideoDetails = styled.div`
  width: 100%;
  background-color: #242731;
  text-align: left;
  padding-top: 4rem;
  margin-top: -3rem;
  border-radius: 32px;
`;

export const DetailHeadingBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 3rem;
`;
