import { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import DatePicker from 'react-datepicker';
import Form from '../styles/Form';
import Card from '../styles/Card';
import Error from '../Error';
import useForm from '../../utilities/useForm';
// import { SelectChoices } from '../styles/SelectChoices';
import { STUDIO_EVENTS_QUERY } from './Queries';
import Router from 'next/router';
import Modal from '../Modal';
import Link from 'next/link';
import styled from 'styled-components';

const CREATE_STUDIO_EVENT = gql`
  mutation CREATE_STUDIO_EVENT(
    $name: String!
    $type: String!
    $ageDivision: [String!]!
    $competitiveLevel: [String!]!
    $style: [String!]!
    $beginDate: DateTime
    $endDate: DateTime
    $location: String
    $address1: String
    $address2: String
    $city: String
    $state: String
    $zip: String
    $url: String
    $notes: String
  ) {
    createStudioEvent(
      name: $name
      type: $type
      ageDivision: $ageDivision
      competitiveLevel: $competitiveLevel
      style: $style
      beginDate: $beginDate
      endDate: $endDate
      location: $location
      address1: $address1
      address2: $address2
      city: $city
      state: $state
      zip: $zip
      url: $url
      notes: $notes
    ) {
      id
      type
      name
    }
  }
`;

const CheckboxAndLabelContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  margin-left: 0.75em;
  label {
    color: ${(props) =>
      props.disabled ? props.theme.disabledText : 'inherit'};
  }
  input {
    color: ${(props) =>
      props.disabled ? props.theme.disabledText : 'inherit'};
    margin-top: 4px;
    margin-right: 8px;
  }
`;
const CategoryOptions = styled.div`
  legend {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: bold;
    p {
      font-size: 14px;
      margin-top: -4px;
    }
    @media (min-width: ${(props) => props.theme.largeScreen}) {
      legend {
        font-size: 18px;
        p {
          font-size: 16px;
        }
      }
    }
  }
`;
const initialInputState = {
  type: '',
  name: '',
  location: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  url: '',
  notes: '',
};
function CreateEventForm({ categories }) {
  const { inputs, handleChange } = useForm(initialInputState);
  const [eventAgeDivision, setEventAgeDivision] = useState(['all']);
  const [eventCompetitiveLevel, setEventCompetitiveLevel] = useState(['all']);
  const [eventStyle, setEventStyle] = useState(['all']);
  const [beginDate, setBeginDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showModal, toggleModal] = useState(false);

  const [createStudioEvent, { data, error, loading }] = useMutation(
    CREATE_STUDIO_EVENT,
    {
      refetchQueries: [{ query: STUDIO_EVENTS_QUERY }],
      awaitRefetchQueries: true,
      onCompleted: () => toggleModal(true),
    }
  );

  function handleEventAgeDivisionChange(choice) {
    const newArray = [...eventAgeDivision];
    if (choice === 'all') {
      setEventAgeDivision(['all']);
      return;
    }
    if (newArray.includes(choice)) {
      //remove choice
      newArray.splice(newArray.indexOf(choice), 1);
      // if now empty, set as  ['all']
      if (newArray.length === 0) {
        setEventAgeDivision(['all']);
      } else {
        setEventAgeDivision(newArray);
      }
    }
    if (!newArray.includes(choice)) {
      //add to array
      newArray.push(choice);
      //remove 'all' if it is in there
      if (newArray.includes('all')) {
        newArray.splice(newArray.indexOf('all'), 1);
      }
      setEventAgeDivision(newArray);
    }
  }
  function handleEventCompLevelChange(choice) {
    const newArray = [...eventCompetitiveLevel];
    if (choice === 'all') {
      setEventCompetitiveLevel(['all']);
      return;
    }
    if (newArray.includes(choice)) {
      //remove choice
      newArray.splice(newArray.indexOf(choice), 1);
      // if now empty, set as  ['all']
      if (newArray.length === 0) {
        setEventCompetitiveLevel(['all']);
      } else {
        setEventCompetitiveLevel(newArray);
      }
    }
    if (!newArray.includes(choice)) {
      //add to array
      newArray.push(choice);
      //remove 'all' if it is in there
      if (newArray.includes('all')) {
        newArray.splice(newArray.indexOf('all'), 1);
      }
      setEventCompetitiveLevel(newArray);
    }
  }
  function handleCategoryChange(state, setFunc, choice) {
    const newArray = [...state];
    if (choice === 'all') {
      setFunc(['all']);
      return;
    }
    if (newArray.includes(choice)) {
      const index = newArray.indexOf(choice);
      newArray.splice(index, 1);
      // if now empty, set as  ['all']
      if (newArray.length === 0) {
        setFunc(['all']);
      } else {
        setFunc(newArray);
      }
      return;
    }
    if (!newArray.includes(choice)) {
      //add to array
      newArray.push(choice);
      //remove 'all' if it is in there
      if (newArray.includes('all')) {
        newArray.splice(newArray.indexOf('all'), 1);
      }
      setFunc(newArray);
    }
  }

  async function saveEvent(e) {
    e.preventDefault();
    const beginningDate = beginDate ? beginDate.toISOString() : null;
    const endingDate = endDate ? endDate.toISOString() : null;
    await createStudioEvent({
      variables: {
        ...inputs,
        ageDivision: eventAgeDivision,
        competitiveLevel: eventCompetitiveLevel,
        style: eventStyle,
        beginDate: beginningDate,
        endDate: endingDate,
      },
    });
  }

  return (
    <>
      <Card>
        <Form
          method='post'
          onSubmit={async (e) => {
            await saveEvent(e);
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <legend>Add A New Event</legend>
            <Error error={error} />
            <div className='input-item'>
              <label htmlFor='name'>
                Name <span className='required'> Required</span>
              </label>
              <input
                required
                type='text'
                name='name'
                value={inputs.name}
                onChange={handleChange}
              />
            </div>
            <div className='form-row'>
              <div className='row-item'>
                <label htmlFor='type'>
                  Type: <span className='required'> Required</span>
                </label>
                <select
                  required
                  id='type'
                  name='type'
                  value={inputs.type}
                  onChange={handleChange}
                >
                  <option default value={''} disabled>
                    Choose Event Type...
                  </option>
                  <option value='competition'>Competition</option>
                  <option value='rehearsal'>Rehearsal</option>
                  <option value='recital'>Recital</option>
                  <option value='convention'>Convention</option>
                  <option value='camp'>Camp</option>
                  <option value='other'>Other</option>
                </select>
              </div>
            </div>

            <section>
              <div>
                <h3>This event applies to:</h3>
              </div>
              <div className='form-row'>
                <CategoryOptions className='row-item'>
                  <legend>
                    Age Division:{' '}
                    <p>
                      <span className='required'> Required</span>
                    </p>
                  </legend>
                  <CheckboxAndLabelContainer>
                    <label>
                      <input
                        type='checkbox'
                        checked={eventAgeDivision.includes('all')}
                        value={'all'}
                        onChange={() =>
                          handleCategoryChange(
                            eventAgeDivision,
                            setEventAgeDivision,
                            'all'
                          )
                        }
                      />
                      All Ages
                    </label>
                  </CheckboxAndLabelContainer>
                  {categories.ageDivisions.map((ageChoice) => (
                    <CheckboxAndLabelContainer key={ageChoice}>
                      <label>
                        <input
                          type='checkbox'
                          checked={eventAgeDivision.includes(ageChoice)}
                          value={ageChoice}
                          onChange={() =>
                            handleCategoryChange(
                              eventAgeDivision,
                              setEventAgeDivision,
                              ageChoice
                            )
                          }
                        />
                        {ageChoice}
                      </label>
                    </CheckboxAndLabelContainer>
                  ))}
                </CategoryOptions>

                <CategoryOptions className='row-item'>
                  <legend>
                    Competitive Level:{' '}
                    <span className='required'> Required</span>
                  </legend>
                  <CheckboxAndLabelContainer>
                    <label>
                      <input
                        type='checkbox'
                        checked={eventCompetitiveLevel.includes('all')}
                        value={'all'}
                        onChange={() =>
                          handleCategoryChange(
                            eventCompetitiveLevel,
                            setEventCompetitiveLevel,
                            'all'
                          )
                        }
                      />
                      All
                    </label>
                  </CheckboxAndLabelContainer>
                  {categories.competitiveLevels.map((compChoice) => (
                    <CheckboxAndLabelContainer key={compChoice}>
                      <label>
                        <input
                          type='checkbox'
                          checked={eventCompetitiveLevel.includes(compChoice)}
                          value={compChoice}
                          onChange={() =>
                            handleCategoryChange(
                              eventCompetitiveLevel,
                              setEventCompetitiveLevel,
                              compChoice
                            )
                          }
                        />
                        {compChoice}
                      </label>
                    </CheckboxAndLabelContainer>
                  ))}
                </CategoryOptions>

                <CategoryOptions className='row-item'>
                  <legend>
                    Style: <span className='required'> Required</span>
                  </legend>
                  <CheckboxAndLabelContainer>
                    <label>
                      <input
                        type='checkbox'
                        checked={eventStyle.includes('all')}
                        value={'all'}
                        onChange={() =>
                          handleCategoryChange(eventStyle, setEventStyle, 'all')
                        }
                      />
                      All Styles
                    </label>
                  </CheckboxAndLabelContainer>
                  {categories.styles.map((styleChoice) => (
                    <CheckboxAndLabelContainer key={styleChoice}>
                      <label>
                        <input
                          type='checkbox'
                          checked={eventStyle.includes(styleChoice)}
                          value={styleChoice}
                          onChange={() =>
                            handleCategoryChange(
                              eventStyle,
                              setEventStyle,
                              styleChoice
                            )
                          }
                        />
                        {styleChoice}
                      </label>
                    </CheckboxAndLabelContainer>
                  ))}
                </CategoryOptions>
              </div>
            </section>

            <div className='form-row'>
              <div className='row-item'>
                <label htmlFor='beginDate'>Begin Date:</label>
                <DatePicker
                  dateFormat='yyyy/MM/dd'
                  id='beginDate'
                  selected={beginDate}
                  onChange={(date) => setBeginDate(date)}
                  popperPlacement='auto'
                />
              </div>
              <div className='row-item'>
                <label htmlFor='endDate'>End Date:</label>
                <DatePicker
                  dateFormat='yyyy/MM/dd'
                  id='endDate'
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  popperPlacement='auto'
                />
              </div>
            </div>
            <div className='input-item'>
              <label htmlFor='website'>Website</label>
              <input
                type='text'
                name='url'
                value={inputs.url}
                onChange={handleChange}
              />
            </div>
            <div className='input-item'>
              <label htmlFor='location'>Location Name</label>
              <input
                type='text'
                name='location'
                value={inputs.location}
                onChange={handleChange}
              />
            </div>
            <div className='input-item'>
              <label htmlFor='address1'>Address Line 1</label>
              <input
                type='text'
                name='address1'
                value={inputs.address1}
                onChange={handleChange}
              />
            </div>
            <div className='input-item'>
              <label htmlFor='address2'>Address Line 2</label>
              <input
                type='text'
                name='address2'
                value={inputs.address2}
                onChange={handleChange}
              />
            </div>
            <div className='form-row'>
              <div className='row-item'>
                <label htmlFor='city'>City</label>
                <input
                  type='text'
                  name='city'
                  value={inputs.city}
                  onChange={handleChange}
                />
              </div>
              <div className='row-item'>
                <label htmlFor='state'>State</label>
                <input
                  className='state'
                  type='text'
                  name='state'
                  value={inputs.state}
                  onChange={handleChange}
                />
              </div>
              <div className='row-item'>
                <label htmlFor='zip'>Zip Code</label>
                <input
                  className='zip'
                  type='text'
                  name='zip'
                  value={inputs.zip}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='input-item'>
              <label htmlFor='notes'>Notes</label>
              <textarea
                id='notes'
                type='text'
                name='notes'
                rows='4'
                value={inputs.notes}
                onChange={handleChange}
              />
            </div>
            {/* footer */}
            <div className='form-footer'>
              <button
                className='btn-action-primary'
                type='submit'
                disabled={loading}
              >
                Creat
                {loading ? 'ing ' : 'e '} Event
              </button>
            </div>
          </fieldset>
        </Form>
      </Card>
      <Modal open={showModal} setOpen={toggleModal}>
        <div>
          {error && (
            <>
              <p>
                Warning: there was a problem creating the event. Please try
                again:
              </p>
              <button
                className='btn-action-primary'
                role='button'
                onClick={() => toggleModal(false)}
              >
                Try Again
              </button>
            </>
          )}

          {data?.createStudioEvent && (
            <p>Success - you created {data.createStudioEvent.name}</p>
          )}
          <div className='modal-options'>
            <button
              className='btn-action-primary'
              role='button'
              onClick={() => toggleModal(false)}
            >
              Create Another Event
            </button>
            <Link href='/studio/events'>
              <a className='btn-action-secondary'>
                I'm finished creating events
              </a>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateEventForm;
