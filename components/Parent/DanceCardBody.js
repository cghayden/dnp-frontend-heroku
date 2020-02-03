import React, { useState } from "react";
import styled from "styled-components";
import AddNote from "./AddNote";
import UpdateParentNotes from "./UpdateParentNotes";

const DanceCardBodyStyles = styled.div`
  padding-bottom: 1rem;
  li {
    padding: 0.25rem;
  }
`;

const NoteItem = styled.div`
  display: flex;
  padding: 0.25rem 0;
`;

const Dt = styled.dt`
  font-weight: bold;
`;
const Dd = styled.dd`
  margin-left: 1rem;
  text-align: left;
  white-space: pre-wrap;
`;
const Notes = styled.div`
  text-align: left;
  padding: 0.25rem 0;
`;
function DanceCardBody({ dance }) {
  const [addNote, toggleAddNote] = useState(false);
  const [editNotes, toggleEditNotes] = useState(false);

  return (
    <DanceCardBodyStyles>
      <dl>
        <NoteItem>
          <Dt>Shoes:</Dt> <Dd>{dance.shoes}</Dd>
        </NoteItem>
        <NoteItem>
          <Dt>Tights:</Dt> <Dd>{dance.tights}</Dd>
        </NoteItem>
        <Notes>
          <Dt>{!dance.custom && `Studio`} Notes:</Dt>{" "}
          <Dd>{dance.notes ? dance.notes : `N/A`}</Dd>
        </Notes>
        {/* {dance.custom ? (
          <CustomNotesDiv
            addNote={addNote}
            toggleAddNote={toggleAddNote}
            editNote={editNote}
            toggleEditNote={toggleEditNotes}
            notes={dance.notes}
            danceId={danceId}
          />
        ) : (
          <NotesDiv
            addNote={addNote}
            toggleAddNote={toggleAddNote}
            editNote={editNote}
            toggleEditNote={toggleEditNotes}
            notes={dance.notes}
            danceId={danceId}
          />
        )} */}
        {!dance.parentsNotes && !addNote && (
          <button
            className="btn-action-primary-outline"
            onClick={() => toggleAddNote(true)}
          >
            + Note
          </button>
        )}
        {dance.parentsNotes && (
          <Notes>
            <Dt>My Notes:</Dt>
            {!editNotes && <Dd>{dance.parentsNotes.note}</Dd>}
          </Notes>
        )}

        {editNotes && (
          <UpdateParentNotes
            existingNote={dance.parentsNotes}
            danceId={dance.id}
            toggleEditNotes={toggleEditNotes}
          />
        )}
        {addNote && (
          <Notes>
            <Dt>My Notes:</Dt>
            <AddNote toggleAddNote={toggleAddNote} danceId={dance.id} />
          </Notes>
        )}
      </dl>
      {dance.parentsNotes && !editNotes && (
        <button
          className="btn-action-primary-outline"
          onClick={() => toggleEditNotes(true)}
        >
          Add/Edit Notes
        </button>
      )}
    </DanceCardBodyStyles>
  );
}

export default DanceCardBody;
