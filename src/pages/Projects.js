import { useEffect, useState } from 'react';
import axios from '../store/axiosInstance';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectOption } from '../components/ui/select';
import { Edit, Trash } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ project, handleEdit, handleDelete, user }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="transition-transform transform hover:scale-105">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        <p className="text-sm text-gray-400">{project.description}</p>
        <div className="text-sm mt-2">Status: {project.status}</div>
        <div className="text-sm mt-1">Owner: {project.owner?.username}</div>
        <div className="text-sm mt-1">Participants: {project.participants.map(p => p.username).join(', ')}</div>
        {project.owner?.id === user?.id && (
          <div className="flex gap-2 mt-3">
            <Button onClick={() => handleEdit(project)} size="sm" variant="secondary">
              <Edit className="w-4 h-4" />
            </Button>
            <Button onClick={() => handleDelete(project.id)} size="sm" variant="destructive" className="transition-all transform hover:scale-110">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const { user } = useSelector(state => state.auth);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', participants: [], status: 'active' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects/');
      if (Array.isArray(res.data.results)) {
        setProjects(res.data.results);
      } else {
        console.error("Projects data is not an array:", res.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users/list/');
      if (Array.isArray(res.data.results)) {
        setUsers(res.data.results);
      } else {
        console.error("Users data is not an array:", res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, o => o.value);
    setForm(prev => ({ ...prev, participants: selected }));
  };

  const validateForm = () => {
    if (!form.name || !form.description) {
      alert('Please fill out all required fields!');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = { ...form, participants: form.participants };

    try {
      if (editingProjectId) {
        await axios.put(`/projects/${editingProjectId}/`, payload);
      } else {
        await axios.post('/projects/', payload);
      }
      setIsOpen(false);
      setForm({ name: '', description: '', participants: [], status: 'active' });
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      description: project.description,
      participants: project.participants.map(p => p.id),
      status: project.status,
    });
    setEditingProjectId(project.id);
    setIsOpen(true);
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`/projects/${projectId}/`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      setProjects(prev => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div className="bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="flex gap-4">
          <select onChange={(e) => setSortBy(e.target.value)} className="bg-gray-900 text-white p-2 border rounded-lg">
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setForm({ name: '', description: '', participants: [], status: 'active' }); setEditingProjectId(null); }}>+ New Project</Button>
            </DialogTrigger>
            <DialogContent aria-describedby="project-description">
              <DialogHeader>{editingProjectId ? 'Edit Project' : 'Create Project'}</DialogHeader>
              <div id="project-description" className="space-y-4">
                <p id="dialog-description" className="sr-only">Form to create or edit a project.</p>
                <div>
                  <Label>Name</Label>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input name="description" value={form.description} onChange={handleChange} />
                </div>
                <div>
                  <Label>Participants</Label>
                  <select multiple className="w-full p-2 border rounded" value={form.participants} onChange={handleParticipantsChange}>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select name="status" value={form.status} onChange={handleChange}>
                    <SelectOption value="active">Active</SelectOption>
                    <SelectOption value="archived">Archived</SelectOption>
                  </Select>
                </div>
                <Button onClick={handleSubmit}>{editingProjectId ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProjects.map(project => (
              <SortableItem
                key={project.id}
                project={project}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                user={user}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import axios from '../store/axiosInstance';
// import { useSelector } from 'react-redux';
// import { Card, CardContent } from '../components/ui/card';
// import { Button } from '../components/ui/button';
// import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '../components/ui/dialog';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Select, SelectOption } from '../components/ui/select';
// import { TrashIcon, EditIcon } from '../components/ui/icons';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
//
// function SortableItem({ project, handleEdit, handleDelete, user }) {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };
//
//   return (
//     <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="transition-transform transform hover:scale-105">
//       <CardContent className="p-4">
//         <h3 className="font-semibold text-lg">{project.name}</h3>
//         <p className="text-sm text-gray-600">{project.description}</p>
//         <div className="text-xs mt-2">Status: {project.status}</div>
//         <div className="text-xs mt-1">Owner: {project.owner?.username}</div>
//         <div className="text-xs mt-1">Participants: {project.participants.map(p => p.username).join(', ')}</div>
//         {project.owner?.id === user?.id && (
//           <div className="flex gap-2 mt-3">
//             <Button onClick={() => handleEdit(project)} size="sm" variant="secondary"><EditIcon className="w-4 h-4" /></Button>
//             <Button onClick={() => handleDelete(project.id)} size="sm" variant="destructive" className="transition-all transform hover:scale-110"><TrashIcon className="w-4 h-4" /></Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
//
// export default function Projects() {
//   const { user } = useSelector(state => state.auth);
//   const [projects, setProjects] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [form, setForm] = useState({ name: '', description: '', participants: [], status: 'active' });
//   const [editingProjectId, setEditingProjectId] = useState(null);
//   const [sortBy, setSortBy] = useState('name');
//   const sensors = useSensors(useSensor(PointerSensor));
//
//   useEffect(() => {
//     fetchProjects();
//     fetchUsers();
//   }, []);
//
//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get('/projects/');
//       if (Array.isArray(res.data.results)) {
//         setProjects(res.data.results);
//       } else {
//         console.error("Projects data is not an array:", res.data);
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   };
//
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get('/users/list/');
//       if (Array.isArray(res.data.results)) {
//         setUsers(res.data.results);
//       } else {
//         console.error("Users data is not an array:", res.data);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };
//
//   const handleParticipantsChange = (e) => {
//     const selected = Array.from(e.target.selectedOptions, o => o.value);
//     setForm(prev => ({ ...prev, participants: selected }));
//   };
//
//   const validateForm = () => {
//     if (!form.name || !form.description) {
//       alert('Please fill out all required fields!');
//       return false;
//     }
//     return true;
//   };
//
//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//
//     const payload = { ...form, participants: form.participants };
//
//     try {
//       if (editingProjectId) {
//         await axios.put(`/projects/${editingProjectId}/`, payload);
//       } else {
//         await axios.post('/projects/', payload);
//       }
//       setIsOpen(false);
//       setForm({ name: '', description: '', participants: [], status: 'active' });
//       setEditingProjectId(null);
//       fetchProjects();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };
//
//   const handleEdit = (project) => {
//     setForm({
//       name: project.name,
//       description: project.description,
//       participants: project.participants.map(p => p.id),
//       status: project.status,
//     });
//     setEditingProjectId(project.id);
//     setIsOpen(true);
//   };
//
//   const handleDelete = async (projectId) => {
//     try {
//       await axios.delete(`/projects/${projectId}/`);
//       fetchProjects();
//     } catch (error) {
//       console.error("Error deleting project:", error);
//     }
//   };
//
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       const oldIndex = projects.findIndex(p => p.id === active.id);
//       const newIndex = projects.findIndex(p => p.id === over.id);
//       setProjects(prev => arrayMove(prev, oldIndex, newIndex));
//     }
//   };
//
//   const sortedProjects = [...projects].sort((a, b) => {
//     if (sortBy === 'name') return a.name.localeCompare(b.name);
//     if (sortBy === 'status') return a.status.localeCompare(b.status);
//     return 0;
//   });
//
//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Projects</h2>
//         <div className="flex gap-4">
//           <select onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
//             <option value="name">Sort by Name</option>
//             <option value="status">Sort by Status</option>
//           </select>
//           <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogTrigger asChild>
//               <Button onClick={() => { setForm({ name: '', description: '', participants: [], status: 'active' }); setEditingProjectId(null); }}>+ New Project</Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>{editingProjectId ? 'Edit Project' : 'Create Project'}</DialogHeader>
//               <div className="space-y-4">
//                 <div>
//                   <Label>Name</Label>
//                   <Input name="name" value={form.name} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Description</Label>
//                   <Input name="description" value={form.description} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Participants</Label>
//                   <select multiple className="w-full p-2 border rounded" value={form.participants} onChange={handleParticipantsChange}>
//                     {users.map(user => (
//                       <option key={user.id} value={user.id}>{user.username}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <Label>Status</Label>
//                   <Select name="status" value={form.status} onChange={handleChange}>
//                     <SelectOption value="active">Active</SelectOption>
//                     <SelectOption value="archived">Archived</SelectOption>
//                   </Select>
//                 </div>
//                 <Button onClick={handleSubmit}>{editingProjectId ? 'Update' : 'Create'}</Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//
//       <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//         <SortableContext items={sortedProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {sortedProjects.map(project => (
//               <SortableItem
//                 key={project.id}
//                 project={project}
//                 handleEdit={handleEdit}
//                 handleDelete={handleDelete}
//                 user={user}
//               />
//             ))}
//           </div>
//         </SortableContext>
//       </DndContext>
//     </div>
//   );
// }
