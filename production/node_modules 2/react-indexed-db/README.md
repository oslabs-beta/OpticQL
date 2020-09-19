# react-indexed-db

react-indexed-db is a service that wraps IndexedDB database in an "easier to use" service.
It exposes very simple promises API to enable the usage of IndexedDB without most of it plumbing.

## Installation

```js
npm install react-indexed-db
```

## Creating the DB

You can choose to work with the indexed db as an context or to use it as a hook.

### To use it as a hook

- Fist initialized your DB before to be able to use the hooks inside other components:

```js
//DBConfig.js|tsx

export const DBConfig = {
  name: 'MyDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'people',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } }
      ]
    }
  ]
};
```

```js
//App.js|tsx

import React from 'react';
import { DBConfig } from './DBConfig';
import { initDB } from 'react-indexed-db';

initDB(DBConfig);

const App: React.FC = () => {
  return <div>...</div>;
};
```

### To use it as an context:

- First you have to declare inside `<IndexedDB></IndexedDB>` all the components you want to be able access the DB:

```js
import { IndexedDB } from 'react-indexed-db';
import PanelExample from './Panel';

function App() {
  return (
    <IndexedDB
      name="MyDB"
      version={1}
      objectStoresMeta={[
        {
          store: 'people',
          storeConfig: { keyPath: 'id', autoIncrement: true },
          storeSchema: [
            { name: 'name', keypath: 'name', options: { unique: false } },
            { name: 'email', keypath: 'email', options: { unique: false } }
          ]
        }
      ]}>
      <Panel />
    </IndexedDB>
  );
}
```

## Accessing and working with the DB

- In any component inside this context or in an app using the hooks after creating the DB you can consume it like bellow:

```js
// Context
import { AccessDB } from 'react-indexed-db';

export default function PanelExample() {
  return (
    <AccessDB objectStore="people">
      {db => {
        console.log('MyDB: ', db);
        return <div>{JSON.stringify(db)}</div>;
      }}
    </AccessDB>
  );
}

// Hooks
import { useIndexedDB } from 'react-indexed-db';

export default function PanelExample() {
  const db = useIndexedDB('people');

  return (<div>{JSON.stringify(db)}</div>);
}
```

#### getByID(id)

It returns the object that is stored in the objectStore by its id.
**getByID** returns a promise that is resolved when we have the object or rejected if an error occurred.

Usage example:

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ getById }) => {
    const [person, setPerson] = useState(null);
    getById('people', 1).then(
      personFromDB => {
        setPerson(personFromDB);
      },
      error => {
        console.log(error);
      }
    );
    return <div>{person}</div>;
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function ByID() {
  const { getByID } = useIndexedDB('people');
  const [person, setPerson] = useState();

  useEffect(() => {
    getById(1).then(personFromDB => {
      setPerson(personFromDB);
    });
  }, []);

  return <div>{person}</div>;
}
```

#### getAll()

It returns an array of all the items in the given objectStore.
**getAll** returns a promise that is resolved when we have the array of items or rejected if an error occurred.

Usage example:

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ getAll }) => {
    const [persons, setPersons] = useState(null);
    getAll().then(
      peopleFromDB => {
        setPersons(peopleFromDB);
      },
      error => {
        console.log(error);
      }
    );
    return (
      <div>
        {personsFromDB.map(person => (
          <span>{person}</span>
        ))}
      </div>
    );
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function ShowAll() {
  const { getAll } = useIndexedDB('people');
  const [persons, setPersons] = useState();

  useEffect(() => {
    getAll().then(personsFromDB => {
      setPersons(personsFromDB);
    });
  }, []);

  return (
    <div>
      {personsFromDB.map(person => (
        <span>{person}</span>
      ))}
    </div>
  );
}
```

#### getByIndex(indexName, key)

It returns an stored item using an objectStore's index.
The first parameter is the index and the second is the item to query.
**getByIndex** returns a promise that is resolved when the item successfully returned or rejected if an error occurred.

Usage example:

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ getByIndex }) => {
    const [person, setPerson] = useState(null);
    getByIndex('name', 'Dave').then(
      personFromDB => {
        setPerson(peopleFromDB);
      },
      error => {
        console.log(error);
      }
    );
    return <div>{person}</div>;
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function ByIndex() {
  const { getByIndex } = useIndexedDB('people');
  const [person, setPerson] = useState();

  useEffect(() => {
    getByIndex('name', 'Dave').then(personFromDB => {
      setPerson(peopleFromDB);
    });
  }, []);
  return <div>{person}</div>;
}
```

#### add(value, key)

It Adds to the given objectStore the key and value pair.
The firt parameter is the value and the second is the key (if not auto-generated).
**add** returns a promise that is resolved when the value was added or rejected if an error occurred.

Usage example (add without a key since it's configured to be auto generated):

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ add }) => {
    const handleClick = () => {
      add({ name: 'name', email: 'email' }).then(
        event => {
          console.log('ID Generated: ', event.target.result);
        },
        error => {
          console.log(error);
        }
      );
    };

    return <button onClick={handleClick}>Add</button>;
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function AddMore() {
  const { add } = useIndexedDB('people');
  const [person, setPerson] = useState();

  const handleClick = () => {
    add({ name: 'name', email: 'email' }).then(
      event => {
        console.log('ID Generated: ', event.target.result);
      },
      error => {
        console.log(error);
      }
    );
  };

  return <button onClick={handleClick}>Add</button>;
}
```

#### update(value, key?)

It updates the given value in the objectStore.
The first parameter is the value to update and the second is the key (if there is no key don't provide it).
**update** returns a promise that is resolved when the value was updated or rejected if an error occurred.

Usage example (update without a key):

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ update }) => {
    return (
      <button
        onClick={() => {
          update({ id: 3, name: 'NewName', email: 'NewEmail' }).then(
            () => {
              // Do something after update
            },
            error => {
              console.log(error);
            }
          );
        }}>
        Update
      </button>
    );
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function Edit() {
  const { update } = useIndexedDB('people');
  const [person, setPerson] = useState();

  const handleClick = () => {
    update({ id: 3, name: 'NewName', email: 'NewNEmail' }).then(event => {
      alert('Edited!');
    });
  };

  return <button onClick={handleClick}>Update</button>;
}
```

#### delete(key)

deletes the object that correspond with the key from the objectStore.
The first parameter is the key to delete.
**delete** returns a promise that is resolved when the value was deleted or rejected if an error occurred.

Usage example:

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ deleteRecord }) => {
    const handleClick = () => {
      deleteRecord(3).then(event => {
        alert('Deleted!');
      });
    };
    return <button onClick={handleClick}>Delete</button>;
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function Delete() {
  const { deleteRecord } = useIndexedDB('people');

  const handleClick = () => {
    deleteRecord(3).then(event => {
      alert('Deleted!');
    });
  };

  return <button onClick={handleClick}>Delete</button>;
}
```

#### openCursor(cursorCallback, keyRange)

It opens an objectStore cursor to enable iterating on the objectStore.
The first parameter is a callback function to run when the cursor succeeds to be opened and the second is optional IDBKeyRange object.
**openCursor** returns a promise that is resolved when the cursor finishes running or rejected if an error occurred.

Usage example:

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB objectStore="people">
  {({ openCursor }) => {
    const handleClick = () => {
      openCursor(evt => {
        var cursor = evt.target.result;
        if (cursor) {
          console.log(cursor.value);
          cursor.continue();
        } else {
          console.log('Entries all displayed.');
        }
      }, IDBKeyRange.bound('A', 'F'));
    };
    return <button onClick={handleClick}>Run cursor</button>;
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function Open() {
  const { openCursor } = useIndexedDB('people');

  const handleClick = () => {
    openCursor(evt => {
      var cursor = evt.target.result;
      if (cursor) {
        console.log(cursor.value);
        cursor.continue();
      } else {
        console.log('Entries all displayed.');
      }
    }, IDBKeyRange.bound('A', 'F'));
  };

  return <button onClick={handleClick}>Run cursor</button>;
}
```

#### clear()

It clears all the data in the objectStore.
**clear** returns a promise that is resolved when the objectStore was cleared or rejected if an error occurred.

Usage example:

```js
// Context
import { AccessDB } from 'react-indexed-db';

<AccessDB>
  {({ clear }) => {
    const handleClick = () => {
      clear().then(() => {
        alert('All Clear!');
      });
    };
    return <button onClick={handleClick}>Clear All</button>;
  }}
</AccessDB>;

// Hooks
import { useIndexedDB } from 'react-indexed-db';

function ClearAll() {
  const { clear } = useIndexedDB('people');

  const handleClick = () => {
    clear().then(() => {
      alert('All Clear!');
    });
  };

  return <button onClick={handleClick}>Clear All</button>;
}
```

## TODO

- [ ] Improve this documentation
- [x] Implement Hooks `const {getAll, add ...} = useIndexedDB({name, version, dbSchema?})`
- [ ] Handle `getAll()` perfomance issue regarding re-render
- [ ] Implement examples/Demos

## License

Released under the terms of the [MIT License](LICENSE).
