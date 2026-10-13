from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from datetime import datetime


app = FastAPI(title="Contact Book API")


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==================================================
# JSON FILE
# ==================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILE_NAME = os.path.join(
    BASE_DIR,
    "contacts.json"
)


# ==================================================
# CONTACT MODEL
# ==================================================

class Contact(BaseModel):

    name: str
    phone: str
    email: str
    group: str = "Other"
    favorite: bool = False


# ==================================================
# READ CONTACTS
# ==================================================

def read_contacts():

    if not os.path.exists(FILE_NAME):
        return []

    try:

        with open(FILE_NAME, "r") as file:
            return json.load(file)

    except json.JSONDecodeError:

        return []


# ==================================================
# SAVE CONTACTS
# ==================================================

def save_contacts(contacts):

    with open(FILE_NAME, "w") as file:

        json.dump(
            contacts,
            file,
            indent=4
        )


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():

    return {
        "message": "Contact Book API is running"
    }


# ==================================================
# ADD CONTACT
# ==================================================

@app.post("/contacts")
def add_contact(contact: Contact):

    contacts = read_contacts()

    # Check duplicate phone
    for item in contacts:

        if item["phone"] == contact.phone:

            raise HTTPException(
                status_code=400,
                detail="Phone number already exists"
            )


    # Generate ID
    if len(contacts) == 0:

        new_id = 1

    else:

        new_id = max(
            item["id"]
            for item in contacts
        ) + 1


    new_contact = {

        "id": new_id,

        "name": contact.name,

        "phone": contact.phone,

        "email": contact.email,

        "group": contact.group,

        "favorite": contact.favorite,

        "created_at":
            datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

        "last_viewed":
            datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )
    }


    contacts.append(new_contact)

    save_contacts(contacts)


    return {
        "message": "Contact added successfully",
        "contact": new_contact
    }


# ==================================================
# GET ALL CONTACTS
# ==================================================

@app.get("/contacts")
def get_contacts():

    return read_contacts()


# ==================================================
# SEARCH BY NAME
# ==================================================

@app.get("/contacts/search/name/{name}")
def search_by_name(name: str):

    contacts = read_contacts()

    results = []

    for contact in contacts:

        if name.lower() in contact["name"].lower():

            results.append(contact)


    return results


# ==================================================
# SEARCH BY PHONE
# ==================================================

@app.get("/contacts/search/phone/{phone}")
def search_by_phone(phone: str):

    contacts = read_contacts()

    results = []

    for contact in contacts:

        if phone in contact["phone"]:

            results.append(contact)


    return results


# ==================================================
# UPDATE CONTACT
# ==================================================

@app.put("/contacts/{contact_id}")
def update_contact(
    contact_id: int,
    contact: Contact
):

    contacts = read_contacts()


    for item in contacts:

        if item["id"] == contact_id:

            # Duplicate phone check

            for other in contacts:

                if (
                    other["id"] != contact_id
                    and other["phone"] == contact.phone
                ):

                    raise HTTPException(
                        status_code=400,
                        detail="Phone number already exists"
                    )


            item["name"] = contact.name

            item["phone"] = contact.phone

            item["email"] = contact.email

            item["group"] = contact.group

            item["favorite"] = contact.favorite


            save_contacts(contacts)


            return {
                "message":
                    "Contact updated successfully",

                "contact": item
            }


    raise HTTPException(
        status_code=404,
        detail="Contact not found"
    )


# ==================================================
# DELETE CONTACT
# ==================================================

@app.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int):

    contacts = read_contacts()


    for contact in contacts:

        if contact["id"] == contact_id:

            contacts.remove(contact)

            save_contacts(contacts)


            return {
                "message":
                    "Contact deleted successfully"
            }


    raise HTTPException(
        status_code=404,
        detail="Contact not found"
    )


# ==================================================
# TOGGLE FAVORITE
# ==================================================

@app.patch("/contacts/{contact_id}/favorite")
def toggle_favorite(contact_id: int):

    contacts = read_contacts()


    for contact in contacts:

        if contact["id"] == contact_id:

            contact["favorite"] = not contact.get(
                "favorite",
                False
            )

            save_contacts(contacts)


            return {
                "message":
                    "Favorite status updated",

                "favorite":
                    contact["favorite"]
            }


    raise HTTPException(
        status_code=404,
        detail="Contact not found"
    )


# ==================================================
# FAVORITES
# ==================================================

@app.get("/contacts/favorites")
def get_favorites():

    contacts = read_contacts()


    return [
        contact
        for contact in contacts
        if contact.get("favorite", False)
    ]


# ==================================================
# GROUPS
# ==================================================

@app.get("/contacts/groups")
def get_groups():

    contacts = read_contacts()

    groups = {}


    for contact in contacts:

        group = contact.get(
            "group",
            "Other"
        )

        if group not in groups:

            groups[group] = 0

        groups[group] += 1


    return groups


# ==================================================
# RECENT CONTACTS
# ==================================================

@app.get("/contacts/recent")
def get_recent_contacts():

    contacts = read_contacts()


    contacts.sort(
        key=lambda x:
        x.get("last_viewed", ""),
        reverse=True
    )


    return contacts[:5]


# ==================================================
# STATISTICS
# ==================================================

@app.get("/contacts/statistics")
def get_statistics():

    contacts = read_contacts()


    total = len(contacts)


    favorites = len([
        contact
        for contact in contacts
        if contact.get("favorite", False)
    ])


    groups = {}


    for contact in contacts:

        group = contact.get(
            "group",
            "Other"
        )

        if group not in groups:

            groups[group] = 0

        groups[group] += 1


    return {

        "total": total,

        "favorites": favorites,

        "groups": groups
    }