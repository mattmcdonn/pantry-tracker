'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, Paper, Container, CssBaseline, List, ListItem, ListItemText } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // update inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // add item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // remove item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setItemName(searchText);

    if (searchText.length > 0) {
      const filteredResults = inventory.filter(item =>
        item.name.toLowerCase().includes(searchText)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectItem = (itemName) => {
    setItemName(itemName);
    setSearchResults([]);
  };

  return (
    <>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{
          background: 'linear-gradient(135deg, #f0f0f0 25%, #d0d0d0 100%)',
        }}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="background.paper"
            border="none"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
              borderRadius: '10px',
              border: '2px solid',
              borderImage: 'linear-gradient(45deg, #6e8efb, #a777e3) 1',
            }}
          >
            <Typography variant="h6" fontFamily="Roboto, sans-serif">Add Item</Typography>
            <Stack width="100%" direction="column" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={handleSearch}
              />
              {searchResults.length > 0 && (
                <List>
                  {searchResults.map(item => (
                    <ListItem button key={item.name} onClick={() => handleSelectItem(item.name)}>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))}
                </List>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                sx={{
                  background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
                    opacity: 0.9,
                  },
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Typography variant='h4' fontFamily="Roboto, sans-serif" mb={2} sx={{ color: '#333' }}>
          Pantry Items
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
              opacity: 0.9,
            },
          }}
        >
          Add New Item
        </Button>
        <Box sx={{ width: '90%', maxWidth: 800, textAlign: 'center' }}>
          <Stack width="100%" spacing={2} p={2} maxHeight="60vh" sx={{ overflow: 'auto' }}>
            {inventory.map(({ name, quantity }) => (
              <Paper key={name} elevation={3} sx={{ padding: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h6" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="#333">
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => addItem(name)}
                      sx={{
                        background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => removeItem(name)}
                      sx={{
                        background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #6e8efb, #a777e3)',
                          opacity: 0.9,
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}