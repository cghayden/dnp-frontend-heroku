import styled from "styled-components";

const Card = styled.div`
  text-align: center;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.blackText};
  /* color: ${props => props.theme.newBlue[90].hsl}; */
  background-color: ${props => props.theme.gray0};
  box-shadow: ${props => props.theme.dropShadow1};
  margin: 0 auto 1rem auto;
  padding: 1rem 3vmin;
  width: 94%;
  min-width: 310px;
  max-width: 600px;

  .card__header {
    display: flex;
    padding-bottom: 1rem;
  }
  .card__header--editButton {
    margin-left: auto;
  }
  .card__section {
    padding: 1rem 0;
    p {
      padding: 0.5rem 0;
    }
  }
  .img-large {
    width: 300px;
    height: 300px;
  }
  .message {
    margin-bottom: 0;
    padding-top: .5rem;
    padding-bottom: .5rem;
    font-size: 14px;
  }
`;

export default Card;
