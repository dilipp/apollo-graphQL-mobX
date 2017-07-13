import React from 'react';
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL';
import withMutation from 'react-apollo-decorators/lib/withMutation';
import gql from 'graphql-tag';
import { observer, inject } from 'mobx-react';

/* Fetch Query */
const contactsListQuery = gql`
   query ContactsListQuery {
    contacts {
      id,
      name,
      city
    }
   }
 `;
/* Add contact mutation */
const addContactMutation = gql`
  mutation createContact($name: String!,$id: String,$city: String) {
    createContact(name: $name, id: $id, city: $city) {
      id
      name
      city
    }
  }
`;

@withGraphQL(contactsListQuery)
@withMutation(addContactMutation)
@inject('syncStore') @observer
export default class ContactList extends React.Component {
    syncStore;
    constructor(props) {
        super(props);
        this.syncStore = this.props.syncStore;
    }
    itemSelected = (contactInfo) => {
        this.syncStore.setSelectedContact(contactInfo);
    }
    async save() {
        try {
            const result = await this.props.createContact({
                id: Date.now(),
                name: 'Dilip ' + Date.now(),
                city: 'Gurgaon'
            })
            console.log('Success', result);
            this.props.refetch();
        } catch (error) {
            console.log('Error', error)
        }
    }
    render() {
        return (
            <div>
                {this.props.error &&
                    <p>Error ...</p>
                }
                {this.props.loading &&
                    <p>Loading ...</p>
                }
                <div>Comp 1 (GraphQL/MobX)</div>
                <ul>
                    {this.props.contacts.map(c => <li onClick={() => this.itemSelected(c)} key={c.id}>{c.name}</li>)}
                </ul>
                <input type="button" value="Add Contact" onClick={() => this.save()} />
            </div>
        )
    }
}