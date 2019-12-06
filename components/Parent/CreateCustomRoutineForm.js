import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import styled from "styled-components";
import Error from "../Error";
import Link from "next/link";
import Form from "../styles/Form";
import SuccessMessage from "../SuccessMessage";
import { PARENTS_STUDIOS, ALL_Rs } from "./Queries";

const StyledCreateClassForm = styled(Form)`
  .day {
    text-align: center;
    label {
      display: inline-block;
    }
    input {
      width: 100px;
    }
  }
  .formGroup {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .formGroup-item {
      display: grid;
      place-content: center;
    }
    select,
    input {
      width: 150px;
      display: block;
      padding: 0.5rem;
    }
  }
`;

const PARENTS_DANCERS_QUERY = gql`
  query {
    parentsDancers {
      firstName
      id
    }
  }
`;

const CREATE_CUSTOM_ROUTINE_MUTATION = gql`
  mutation CREATE_CUSTOM_ROUTINE_MUTATION(
    $name: String!
    $performanceName: String
    $day: String
    $startTime: String
    $endTime: String
    $shoes: String
    $tights: String
    $notes: String
    $music: String
    $dancer: ID!
    $studio: ID!
  ) {
    createCustomRoutine(
      name: $name
      performanceName: $performanceName
      day: $day
      startTime: $startTime
      endTime: $endTime
      shoes: $shoes
      tights: $tights
      notes: $notes
      music: $music
      dancer: $dancer
      studio: $studio
    ) {
      name
    }
  }
`;

class CreateCustomRoutineForm extends Component {
  state = {
    name: "",
    day: "",
    startTime: "",
    endTime: "",
    performanceName: "",
    shoes: "",
    tights: "",
    notes: "",
    music: "",
    showSuccessMessage: false,
    loadingSong: false,
    dancer: "",
    studio: ""
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setSongtoState = e => {
    const audioFile = e.target.files[0];
    this.setState({ audioFile });
  };

  uploadSong = async e => {
    // this.setState({ loadingSong: true });
    // const files = e.target.files;
    const data = new FormData();
    data.append("file", this.state.audioFile);
    data.append("upload_preset", "dancernotes-music");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/coreytesting/video/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    this.setState({
      music: file.secure_url,
      loadingSong: false
    });
  };

  closeSuccessMessage = () => {
    this.setState({ showSuccessMessage: false });
  };

  onSuccess = () => {
    Router.push({
      pathname: "/parent/notes/routines"
    });
  };

  saveCustomRoutine = async (e, createCustomRoutineMutation) => {
    e.preventDefault();
    //1. createRoutine
    const newRoutine = await createCustomRoutineMutation({
      variables: {
        ...this.state
      }
    });
    //2. get Routine Id
    //3. upload music with tag of routine
    //4 update routine
    console.log("newRoutine:", newRoutine);
    this.setState({
      name: "",
      day: "",
      startTime: "",
      endTime: "",
      performanceName: "",
      shoes: "",
      tights: "",
      notes: "",
      music: "",
      dancer: "",
      studio: ""
    });
  };

  render() {
    return (
      <Query query={PARENTS_STUDIOS}>
        {({ data: { parentStudios } = {}, error, loading }) => {
          if (error) return <Error error={error} />;
          return (
            <Query query={PARENTS_DANCERS_QUERY}>
              {({ data: { parentsDancers } = {}, loading, error }) => {
                return (
                  <Mutation
                    mutation={CREATE_CUSTOM_ROUTINE_MUTATION}
                    onCompleted={({ createCustomRoutine }) =>
                      this.onSuccess(createCustomRoutine)
                    }
                    refetchQueries={[{ query: ALL_Rs }]}
                    awaitRefetchQueries={true}
                  >
                    {(createCustomRoutine, { error, loading }) => {
                      return (
                        <div>
                          {this.state.showSuccessMessage && (
                            <SuccessMessage
                              closeFunc={this.closeSuccessMessage}
                            />
                          )}
                          <StyledCreateClassForm
                            method="post"
                            onSubmit={async e =>
                              await this.saveCustomRoutine(
                                e,
                                createCustomRoutine
                              )
                            }
                          >
                            <fieldset disabled={loading} aria-busy={loading}>
                              <Error error={error} />
                              <div className="input-item">
                                <label htmlFor="name">Name* </label>
                                <input
                                  required
                                  pattern="(?!^ +$)^.+$"
                                  type="text"
                                  name="name"
                                  placeholder="name"
                                  value={this.state.name}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="input-item">
                                <label htmlFor="dancer">
                                  Dancer*
                                  <p>(You may add other dancers later.)</p>
                                </label>

                                <select
                                  required
                                  id="dancer"
                                  name="dancer"
                                  value={this.state.dancer}
                                  onChange={this.handleChange}
                                >
                                  <option default value={""} disabled>
                                    Dancer...
                                  </option>
                                  {parentsDancers &&
                                    parentsDancers.map(dancer => (
                                      <option key={dancer.id} value={dancer.id}>
                                        {dancer.firstName}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="input-item">
                                <label htmlFor="studio">Studio:</label>
                                <select
                                  required
                                  id="studio"
                                  name="studio"
                                  value={this.state.studio}
                                  onChange={this.handleChange}
                                >
                                  <option default value={""} disabled>
                                    Studio...
                                  </option>
                                  {parentStudios &&
                                    parentStudios.map(studio => (
                                      <option key={studio.id} value={studio.id}>
                                        {studio.studioName}
                                      </option>
                                    ))}
                                  <option value={"None"}>None</option>
                                </select>
                              </div>

                              <div className="formGroup">
                                <div className="day formGroup-item">
                                  <label htmlFor="day">
                                    Day:
                                    <select
                                      id="day"
                                      name="day"
                                      value={this.state.day}
                                      onChange={this.handleChange}
                                    >
                                      <option default value={""} disabled>
                                        Day...
                                      </option>
                                      <option value="Mon.">Mon.</option>
                                      <option value="Tue.">Tue.</option>
                                      <option value="Wed.">Wed.</option>
                                      <option value="Thur.">Thur.</option>
                                      <option value="Fri.">Fri.</option>
                                      <option value="Sat.">Sat.</option>
                                      <option value="Sun.">Sun.</option>
                                    </select>
                                  </label>
                                </div>
                                <div className="formGroup-item">
                                  <label htmlFor="startTime">
                                    Start Time:
                                    <input
                                      type="time"
                                      id="startTime"
                                      name="startTime"
                                      min="0:00"
                                      max="23:59"
                                      value={this.state.startTime}
                                      onChange={this.handleChange}
                                    />
                                  </label>
                                </div>

                                <div className="formGroup-item">
                                  <label htmlFor="endTime">
                                    End Time:
                                    <input
                                      type="time"
                                      id="endTime"
                                      name="endTime"
                                      min="0:00"
                                      max="23:59"
                                      value={this.state.endTime}
                                      onChange={this.handleChange}
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="input-item">
                                <label htmlFor="performanceName">
                                  Performance Name
                                </label>
                                <input
                                  type="text"
                                  name="performanceName"
                                  placeholder="Performance Name, or Name of Song"
                                  value={this.state.performanceName}
                                  onChange={this.handleChange}
                                />
                              </div>

                              <div className="input-item">
                                <label htmlFor="tights">Tights</label>
                                <input
                                  type="text"
                                  name="tights"
                                  placeholder="The style of tights required..."
                                  value={this.state.tights}
                                  onChange={this.handleChange}
                                />
                              </div>

                              <div className="input-item">
                                <label htmlFor="shoes">Shoes</label>
                                <input
                                  type="text"
                                  name="shoes"
                                  placeholder="The style of shoes required..."
                                  value={this.state.shoes}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="input-item">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                  id="notes"
                                  type="text"
                                  name="notes"
                                  rows="5"
                                  value={this.state.notes}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="input-item">
                                <label htmlFor="music">
                                  Upload the music for this dance...
                                </label>
                                <input
                                  type="file"
                                  id="music"
                                  name="music"
                                  placeholder="Upload the music for this dance"
                                  onChange={this.setSongtoState}
                                />
                              </div>

                              <div className="form-footer">
                                <button
                                  type="submit"
                                  disabled={loading || this.state.loadingSong}
                                >
                                  Creat
                                  {loading ? "ing " : "e "} Class
                                </button>
                              </div>
                            </fieldset>
                          </StyledCreateClassForm>
                        </div>
                      );
                    }}
                  </Mutation>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default CreateCustomRoutineForm;
export { StyledCreateClassForm };
