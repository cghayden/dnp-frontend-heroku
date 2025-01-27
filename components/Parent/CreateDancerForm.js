import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Form from '../styles/Form'
import Card from '../styles/Card'
import Link from 'next/link'
import Modal from '../Modal'
import CancelButton from '../CancelButton'
import { PARENT_USER_QUERY } from './Queries'
import { DELETE_CLOUDINARY_ASSET } from '../Mutations'
import { UPDATE_DANCER_MUTATION } from './UpdateDancerForm'
import { useRegistrationContext } from './RegistrationContext'

import useForm from '../../utilities/useForm'
const edgeParents = [
  'kj@edgestudioofdance.com',
  'sljoyce1027@verizon.net',
  'elenathach@gmail.com',
  'ella@ella.com',
  'cghayden@gmail.com',
  'sarah.hayden27@gmail.com',
  'yengbutler@gmail.com',
  'jopetrunyak@yahoo.com',
  'karajdm@yahoo.com',
  'kelli474@msn.com',
  'lilianthana4@yahoo.com',
  'lisabraude@gmail.com',
  'vieira2177@gmail.com',
  'lorironkin@yahoo.com',
  'marcycarty@gmail.com',
  'michaelaellensilva@gmail.com',
  'mullinfam2061@gmail.com',
  'blackcoffee141@msn.com',
  'roudlylaroche@live.com',
  'taradelamere@gmail.com',
  'elcorredor@hotmail.com',
  'adelaidehayden@gmail.com',
  'hondacoupe2004@yahoo.com',
  'svetlana.leeds83@gmail.com',
  'shalinijay@gmail.com',
  'tamaraimcgowan@yahoo.com',
  'z@z.com',
  't@t.com',
  'q@q.com',
]
const directEdgeId =
  process.env.NODE_ENV === 'development'
    ? `ck72koohr0t0r0b901ih2sx2t`
    : `ck6bbkozd000f0745ahefjkcq`
const DancerCardContainer = styled(Card)`
  padding-bottom: 0;
  margin-top: 3rem;
  p {
    margin-bottom: 10px;
  }
`
const DancerCardHeaderStyles = styled.div`
  height: 80px;
  position: relative;
  text-align: right;
  margin-bottom: -20px;
  z-index: 100;
`
const ModalCard = styled(Card)`
  box-shadow: none;
  display: grid;
  grid-gap: 20px;
`

//same as DancerCard with z-index to put it on top of cardBody(form)
const ImageDiv = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  background: ${(props) => props.theme.gray2};
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  border: 5px solid ${(props) => props.theme.gray0};
  text-align: center;
  z-index: 1;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  p {
    font-size: 5rem;
  }
`

const CREATE_DANCER = gql`
  mutation CREATE_DANCER($firstName: String!) {
    createDancer(firstName: $firstName) {
      id
      firstName
      parent {
        id
        email
      }
    }
  }
`

const initialInputState = {
  firstName: '',
}

function CreateDancerForm() {
  const { inputs, updateInputs, handleChange } = useForm(initialInputState)
  const [errorUploadingToCloudinary, setCloudinaryUploadError] = useState()
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState()
  const [avatarForUpload, setAvatarForUpload] = useState()
  const [showModal, toggleModal] = useState(false)
  const [status, setStatus] = useState()
  const [showFileInput, toggleFileInput] = useState(false)
  const { browsingDancerId, setBrowsingDancer } = useRegistrationContext()

  const [
    createDancer,
    { data: newDancer, error: errorCreatingDancer, loading: creatingDancer },
  ] = useMutation(CREATE_DANCER, {
    variables: { ...inputs },
    onCompleted: () => {
      resetForm()
    },
    refetchQueries: [{ query: PARENT_USER_QUERY }],
  })
  console.log('newDancer', newDancer)

  const [
    updateDancer,
    { error: errorUpdatingDancer, loading: updatingDancer },
  ] = useMutation(UPDATE_DANCER_MUTATION)

  const [
    deleteCloudinaryAsset,
    { error: errorDeletingAsset, loading: deletingAsset },
  ] = useMutation(DELETE_CLOUDINARY_ASSET)

  const loading = creatingDancer || updatingDancer || uploadingAvatar
  const errorUploadingAvatar = errorUpdatingDancer || errorUploadingToCloudinary

  const {
    query: { hasDancers },
  } = useRouter()

  function resetForm() {
    updateInputs({ ...initialInputState })
    setAvatarPreview()
    setAvatarForUpload()
    toggleFileInput(false)
    setStatus()
  }

  function handleFileInput(e) {
    setAvatarForUpload(e.target.files[0])
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      // get img from chosen file render thumbnail/avatar.
      const readerResult = e.target.result
      setAvatarPreview(readerResult)
    }
    // read the image file as a data URL in order to display in html<img>.
    reader.readAsDataURL(file)
  }

  //ONLY UPLOAD TO CLOUDINARY ON SAVE
  async function uploadAvatarAndUpdate(dancerId, assetOwnerId) {
    setStatus('Uploading Avatar...')
    setUploadingAvatar(true)
    const data = new FormData()
    data.append('file', avatarForUpload)
    data.append('upload_preset', 'dancernotes-avatars')
    data.append('tags', [dancerId, assetOwnerId])

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/coreytesting/image/upload',
      {
        method: 'POST',
        body: data,
      }
    ).catch((error) => {
      setCloudinaryUploadError(error)
    })
    const file = await res.json()
    if (file.error) {
      setCloudinaryUploadError(file.error)
      setStatus()
      throw `Image Upload failed: ${file.error}`
    }
    setStatus('Saving Avatar...')
    setUploadingAvatar(false)
    await updateDancer({
      variables: {
        id: dancerId,
        avatar: file.secure_url,
        avatarId: file.public_id,
      },
    }).catch(() => {
      // delete avatar file from cloudinary because there was an error updating the dancer with the song url and id
      deleteCloudinaryAsset({
        variables: {
          publicId: file.public_id,
          resourceType: 'image',
        },
      })
    })
  }

  async function saveNewDancer(e) {
    e.preventDefault()
    //1 .save dancer
    setStatus('Saving Dancer...')
    const newDancer = await createDancer()
    //2 get dancerId and parentId for tags on cloudinary avatar
    const newDancerId = newDancer.data.createDancer.id
    const parentId = newDancer.data.createDancer.parent.id
    setBrowsingDancer(newDancerId)
    //3 upload avatar and save to dancer as update
    if (avatarForUpload) {
      await uploadAvatarAndUpdate(newDancerId, parentId)
    }
    toggleModal(true)
    resetForm()
  }

  return (
    <>
      {hasDancers && (
        <Card className='message'>
          <p>Welcome to Dancernotes! To begin, add a Dancer to your account.</p>
        </Card>
      )}
      <Modal open={showModal} setOpen={toggleModal}>
        <ModalCard>
          {errorCreatingDancer && (
            <>
              <p>
                Warning: there was a problem saving your class. Please try
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

          {newDancer && (
            <p>
              Success - you added {newDancer.createDancer.firstName} as a dancer
              to your account
            </p>
          )}
          {newDancer && errorUploadingAvatar && (
            <p>
              Warning: there was a problem uploading the image for
              {newDancer.createDancer.firstName}. You can try to add an image
              now or later by updating the dancer
            </p>
          )}

          <button
            className='btn-action-primary-outline'
            role='button'
            onClick={() => toggleModal(false)}
          >
            Create Another Dancer
          </button>
          <Link href='/parent/dancers'>
            <a className='btn-action-secondary-outline'>I'm finished</a>
          </Link>
          {edgeParents.includes(newDancer?.createDancer.parent.email) && (
            <Link href={`/parent/browseStudio/?studioId=${directEdgeId}`}>
              <a style={{ color: 'blueviolet' }}>
                Take me to Corey's Edge Notes!
              </a>
            </Link>
          )}
        </ModalCard>
      </Modal>

      <DancerCardContainer>
        <DancerCardHeaderStyles>
          <ImageDiv>
            {avatarPreview ? (
              <img src={avatarPreview} alt={`image preview`} />
            ) : (
              <p>{inputs.firstName && inputs.firstName[0]}</p>
            )}
          </ImageDiv>
        </DancerCardHeaderStyles>
        <Form method='post' onSubmit={(e) => saveNewDancer(e)}>
          <fieldset disabled={loading} aria-busy={loading}>
            <div className='input-item'>
              <label htmlFor='firstName'>Name</label>
              <input
                required
                type='text'
                name='firstName'
                placeholder='firstName'
                value={inputs.firstName}
                onChange={handleChange}
              />
            </div>
            <button
              type='button'
              className='btn-action-secondary-outline'
              onClick={() => toggleFileInput(!showFileInput)}
            >
              <div>
                <p style={{ margin: 0 }}>Add Image</p>
                <p style={{ fontSize: '12px', margin: 0 }}>(optional)</p>
              </div>
            </button>
            {showFileInput && (
              <div className='input-item'>
                <label htmlFor='image'>
                  Add a picture of your dancer to easily identify the activities
                  he/she is involved in. (Optional)
                </label>
                <input
                  type='file'
                  id='image'
                  name='image'
                  placeholder='Upload a picture of your dancer'
                  onChange={handleFileInput}
                />
              </div>
            )}
            <p>{status}</p>
            <div className='form-footer'>
              <button className='btn-action-primary' type='submit'>
                Save Dancer
              </button>
              <CancelButton />
            </div>
          </fieldset>
        </Form>
      </DancerCardContainer>
    </>
  )
}

export default CreateDancerForm
