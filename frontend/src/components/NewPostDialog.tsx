import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  InputLabel,
  FormControl,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Spa,
  Mood,
  Favorite,
  Psychology,
  Lightbulb,
} from "@mui/icons-material";
import axios from "axios";

// Define type for categories
interface Category {
  id: string;
  name: string;
}

// Props for the dialog component
interface NewPostDialogProps {
  open: boolean;
  onClose: () => void;
}

const NewPostDialog: React.FC<NewPostDialogProps> = ({ open, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
    mood: "awareness",
    donationLink: "",  // New state for Donation Link
    volunteerLink: "",  // New state for Volunteer Link
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get<Category[]>("/api/v1/categories");
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      }
    };
    if (open) {
      fetchData();
    }
  }, [open]);

  // Handle tag input
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add a new tag when Space is pressed
  const handleTagKeyPress = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === " " && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim();

      try {
        const tagExists = await axios.get(`/api/v1/tags?name=${newTag}`);
        if (!tagExists.data.length) {
          await axios.post(
            "/api/v1/tags",
            { tag: { name: newTag } },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }
        setUserTags((prev) => [...prev, newTag]);
        setTagInput("");
      } catch (error) {
        console.error("Error creating tag:", error);
        setError("Failed to create tag. Please try again.");
      }
    }
  };

  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    setUserTags((prev) => prev.filter((t) => t !== tag));
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/v1/categories/${formData.category_id}/forum_threads`,
        {
          forum_thread: {
            title: formData.title,
            content: formData.content,
            mood: formData.mood,
            category_id: formData.category_id,
            tag_list: userTags.join(","),
            donation_link: formData.donationLink,  // Include Donation Link
            volunteer_link: formData.volunteerLink,  // Include Volunteer Link
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Thread created:", response.data);

      // Close the dialog and reset form on success
      onClose();
      setFormData({
        title: "",
        content: "",
        category_id: "",
        mood: "chill",
        donationLink: "",
        volunteerLink: "",
      });
      setUserTags([]);
    } catch (error) {
      console.error("Error creating thread:", error);
      setError(
        "Failed to create thread. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mood options
  const moods = [
    { value: "awareness", icon: <Spa />, color: "#88c0d0" },
    { value: "action", icon: <Favorite />, color: "#bf616a" },
    { value: "support", icon: <Psychology />, color: "#ebcb8b" },
    { value: "community", icon: <Lightbulb />, color: "#a3be8c" },
  ];

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        style: {
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Create a New Cause</DialogTitle>

      <DialogContent dividers>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 1,
          }}
        >
          <TextField
            fullWidth
            label="Cause Title"
            variant="outlined"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Cause Description"
            variant="outlined"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />

          <FormControl fullWidth>
            <InputLabel>Impact Area</InputLabel>
            <Select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              label="Choose an Impact Area"
              required
            >
              {filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#d8dee9",
                        width: 24,
                        height: 24,
                        fontSize: "0.8rem",
                      }}
                    >
                      {category.name[0]}
                    </Avatar>
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a tag and press Space to add..."
            value={tagInput}
            onChange={handleTagInput}
            onKeyPress={handleTagKeyPress}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {userTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                sx={{
                  fontSize: "0.9rem",
                }}
              />
            ))}
          </Box>

          <TextField
            fullWidth
            label="Donation Link"
            variant="outlined"
            value={formData.donationLink}
            onChange={(e) =>
              setFormData({ ...formData, donationLink: e.target.value })
            }
            placeholder="Enter the donation link"
          />

          <TextField
            fullWidth
            label="Volunteer Link"
            variant="outlined"
            value={formData.volunteerLink}
            onChange={(e) =>
              setFormData({ ...formData, volunteerLink: e.target.value })
            }
            placeholder="Enter the volunteer link"
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Cuase Type
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {moods.map(({ value, icon, color }) => (
                <Button
                  key={value}
                  variant={formData.mood === value ? "contained" : "outlined"}
                  onClick={() => setFormData({ ...formData, mood: value })}
                  sx={{
                    borderColor: color,
                    color: formData.mood === value ? "white" : color,
                    bgcolor: formData.mood === value ? color : "transparent",
                    "&:hover": {
                      bgcolor: formData.mood === value ? color : `${color}10`,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {React.cloneElement(icon, { sx: { fontSize: "1.4rem" } })}
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#88c0d0",
            "&:hover": { bgcolor: "#729cb4" },
          }}
          onClick={handleSubmit}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Create Cause"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPostDialog;
