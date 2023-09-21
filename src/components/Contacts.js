import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import ContactsModal from "./ContactsModal";
import CustomScrollbars from "./CustomScrollbars";
import { updateCountry, incrementPageNo } from "../actions/filterActions";
import { fetchContacts } from "../actions/contactsAction";

const getContacts = (state) => state.contacts.data;
const evenFilter = (state) => state.filter.isOnlyEven;
const filterEvenContacts = createSelector(
  [getContacts, evenFilter],
  (contacts, onlyEven) => {
    if (onlyEven) return contacts.filter((contact) => contact.id % 2 === 0);
    return contacts;
  }
);

const mapStateToProps = (state) => ({
  contactsState: state.contacts,
  contactsData: filterEvenContacts(state),
  pageNo: state.filter.pageNo,
  searchKeyword: state.filter.searchKeyword,
  loading: state.contacts.loading,
  hasErrors: state.contacts.hasErrors,
});

const mapDispatchToProps = (dispatch) => ({
  setCountry: (countryId) => dispatch(updateCountry(countryId)),
  nextPage: () => dispatch(incrementPageNo()),
  fetchData: (countryId, searchKey, pageNo) =>
    dispatch(fetchContacts(countryId, searchKey, pageNo)),
});

const Contacts = ({
  countryId,
  title,
  showContacts,
  pageNo,
  searchKeyword,
  contactsData,
  loading,
  hasErrors,
  selectActiveContact,
  fetchData,
  setCountry,
  nextPage,
}) => {
  const setCountryCallback = useCallback(
    () => setCountry(countryId),
    [countryId, setCountry]
  );
  useEffect(() => {
    setCountryCallback();
  }, [setCountryCallback]);

  useEffect(() => {
    fetchData(countryId, searchKeyword, pageNo);
  }, [countryId, searchKeyword, pageNo , fetchData]);

  const onReachedToBottom = useCallback(() => {
      nextPage();
  }, [nextPage]);

  return (
    <ContactsModal title={title} isOpen={showContacts} isLoading={loading}>
      {!hasErrors && (
        <CustomScrollbars
          onReachedBottom={onReachedToBottom}
          style={{ height: 300 }}
        >
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col" style={{ fontSize: "12px" }}>
                  ID
                </th>
                <th scope="col" style={{ fontSize: "12px" }}>
                  Country 
                </th>
                <th scope="col" style={{ fontSize: "12px" }}>
                  First Name
                </th>
                <th scope="col" style={{ fontSize: "12px" }}>
                  Last Name
                </th>
                <th scope="col" style={{ fontSize: "12px" }}>
                  Email
                </th>
                <th scope="col" style={{ fontSize: "12px" }}>
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {contactsData.map((contact, id) => (
                <tr key={id} onClick={() => selectActiveContact(contact)}>
                  <th scope="row" style={{ fontSize: "12px" }}>
                    {contact.id}
                  </th>
                  <td style={{ fontSize: "12px" }}>{contact.country.iso}</td>
                  <td style={{ fontSize: "12px" }}>{contact.first_name}</td>
                  <td style={{ fontSize: "12px" }}>{contact.last_name}</td>
                  <td style={{ fontSize: "12px" }}>{contact.email}</td>
                  <td style={{ fontSize: "12px" }}>{contact.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CustomScrollbars>
      )}
      {hasErrors && "Error!"}
    </ContactsModal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
