import { DataStore } from '@aws-amplify/datastore';
import { Todo } from './models';

import React from 'react'

const Coolio = () => {
  return (
    <div>
        <form></form>
    </div>
  )
};

export default Coolio;

const save = async (name, description, hours, priority) => {
    await DataStore.save(
        new Todo({
            "name": name,
            "description": description,
            "hours": hours,
            "priority": priority
        })
    );
}