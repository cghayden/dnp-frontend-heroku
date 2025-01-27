import styled from 'styled-components'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { DANCER_QUERY } from './Queries'
import { BROWSE_STUDIO_CLASSES_QUERY } from '../../pages/parent/browseStudio'
import WithdrawButton from './WithdrawButton'
import Error from '../../components/Error'

const ClassListing = styled.div`
  background: ${(props) => props.theme.gray0};
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.dropShadowPizzazz};
  display: grid;
  grid-template-columns: 50% 50%;
  place-items: center;
  margin-bottom: 2rem;
  min-height: 100px;
`

const DanceClassInfo = styled.div``

const DanceClassName = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.gray9};
`

const DanceClassTime = styled.div`
  display: flex;
  flex-wrap: nowrap;
`

const Day = styled.p`
  padding-right: 0.5rem;
`

const DanceClassOptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const RequestedStyle = styled.div`
  background: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.primary};
  border-radius: 5px;
  margin-bottom: 5px;
  p {
    padding: 0.5rem 0.75rem;
  }
`
const EnrolledStyle = styled.div`
  background: ${(props) => props.theme.green7};
  color: white;
  border-radius: 5px;
  margin-bottom: 5px;
  p {
    padding: 0.5rem 0.75rem;
  }
`

const CREATE_DANCECLASS_REQUEST = gql`
  mutation CREATE_DANCECLASS_REQUEST(
    $danceId: ID!
    $dancerId: ID!
    $studioId: ID!
    $parentEmail: String!
  ) {
    requestDance(
      danceId: $danceId
      dancerId: $dancerId
      studioId: $studioId
      parentEmail: $parentEmail
    ) {
      message
    }
  }
`

const DELETE_ENROLLMENT_REQUEST = gql`
  mutation DELETE_ENROLLMENT_REQUEST($requestId: ID!) {
    deleteEnrollmentRequest(requestId: $requestId) {
      message
    }
  }
`

//check to see if dancerId is in array of dancers

function DanceClassInquiryCard({
  //parentEmail is only for request preapproval
  parentEmail,
  dance,
  dancerId,
  dancersRequestsId,
  requested,
  studioId,
  dancerName,
  request,
}) {
  console.log('parentEmail', parentEmail)
  const [
    deleteEnrollmentRequest,
    { error: errorRemovingRequest, loading: removeRequestLoading },
  ] = useMutation(DELETE_ENROLLMENT_REQUEST, {
    refetchQueries: [
      { query: DANCER_QUERY, variables: { id: dancerId } },
      { query: BROWSE_STUDIO_CLASSES_QUERY, variables: { id: studioId } },
    ],
  })

  const [
    requestDance,
    { error: errorRequestingDance, loading: requestingDance },
  ] = useMutation(CREATE_DANCECLASS_REQUEST, {
    variables: {
      parentEmail,
      danceId: dance.id,
      dancerId: dancerId,
      studioId: studioId,
    },
    refetchQueries: [
      { query: DANCER_QUERY, variables: { id: dancerId } },
      { query: BROWSE_STUDIO_CLASSES_QUERY, variables: { id: studioId } },
    ],
  })
  const loading = requestingDance || removeRequestLoading
  const error = errorRequestingDance || errorRemovingRequest
  function isEnrolled(dancerId, dancers) {
    let dancersInDance = []
    for (const dancer of dancers) {
      dancersInDance.push(dancer.id)
    }
    if (dancersInDance.includes(dancerId)) {
      return true
    } else {
      return false
    }
  }

  function getStatus(enrolled, requested) {
    if (enrolled) {
      return 'enrolled'
    }
    if (requested) {
      return 'requested'
    } else {
      return 'available'
    }
  }
  const enrolled = isEnrolled(dancerId, dance.dancers)
  const status = getStatus(enrolled, requested, dancerName)

  return (
    <ClassListing>
      <DanceClassInfo>
        <DanceClassName>{dance.name}</DanceClassName>
        <p>
          <span>{dance.competitiveLevel}</span>
          {'  '}
          <span>{dance.ageDivision}</span>
          {'  '}
          <span>{dance.style}</span>
        </p>
        <DanceClassTime>
          {dance.day && <Day>{dance.day}</Day>}
          <p>
            {dance.startTime && <span>{dance.startTime}</span>}
            {dance.endTime && <span>{` - ${dance.endTime}`}</span>}
          </p>
        </DanceClassTime>
        {removeRequestLoading && <p>Removing request...</p>}
        {loading && <p>Submitting request...</p>}
        {error && <Error error={error} />}
      </DanceClassInfo>
      <DanceClassOptions>
        {status === 'available' && (
          <button
            type='button'
            className='btn-action-primary'
            disabled={loading}
            onClick={async () => {
              await requestDance()
            }}
          >
            Enroll {dancerName}
          </button>
        )}
        {status === 'requested' && (
          <>
            <RequestedStyle>
              <p>Requested for {dancerName}</p>
            </RequestedStyle>
            <button
              type='button'
              className='btn-danger-textOnly btn-small '
              onClick={async () =>
                await deleteEnrollmentRequest({
                  variables: {
                    requestId: request[0].id,
                  },
                })
              }
            >
              Cancel Request
            </button>
          </>
        )}
        {status === 'enrolled' && (
          <div>
            <EnrolledStyle>
              <p>{dancerName} is enrolled</p>
            </EnrolledStyle>
            <WithdrawButton
              danceClassId={dance.id}
              dancerId={dancerId}
              studioId={studioId}
            />
          </div>
        )}
      </DanceClassOptions>
    </ClassListing>
  )
}

export default DanceClassInquiryCard
