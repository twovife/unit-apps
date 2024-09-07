import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import React from 'react';
import Permission from './Components/Permission';
import Role from './Components/Role';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Label } from '@/shadcn/ui/label';
import { Input } from '@/shadcn/ui/input';
import { Button } from '@/shadcn/ui/button';
import SelectList from '@/Components/SelectList';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import { useForm } from '@inertiajs/react';
import AssignRoles from './Components/AssignRoles';

const Index = ({ role, permission, user, ...props }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    role: '',
    permission: [],
  });

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const onCheckboxChange = (e) => {
    const checkboxes = document.querySelectorAll(
      '.checkbox-group input[type="checkbox"]'
    );
    const selectedPermissions = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.name);

    setData((prevState) => ({
      ...prevState,
      permission: selectedPermissions,
    }));
  };

  const roleOptions = role.map((role) => {
    return {
      display: role.name,
      value: role.id,
      id: role.id,
    };
  });
  console.log(roleOptions);

  const userOptions = user.map((emp) => {
    return {
      display: emp.username,
      value: emp.id,
      id: emp.id,
    };
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('adminpanel.role_assign'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Authenticated>
      <div className="flex w-full gap-3 mb-3">
        <Permission />
        <Role />
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Generate Permission</CardTitle>
            <CardDescription>Permission</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col space-y-1.5 mb-3">
                <Label htmlFor="role">Role Name</Label>
                <SelectList
                  options={roleOptions}
                  label="Role"
                  placeholder="Select Role"
                  required
                  name="role"
                  onChange={handleChange}
                  value={data.role}
                  id="role"
                  nullvalue={true}
                />
              </div>
              <div className="flex flex-wrap gap-3 checkbox-group">
                {data.role &&
                  permission.map((pemit, key) => (
                    <div
                      key={key}
                      className="flex items-center flex-1 gap-3 whitespace-nowrap"
                    >
                      <Checkbox
                        name={pemit.name}
                        onChange={onCheckboxChange}
                        placeholder="Select Permission"
                        id={pemit.name}
                      />
                      <InputLabel htmlFor={pemit.name}>{pemit.name}</InputLabel>
                    </div>
                  ))}
              </div>

              <Button type="submit" className="mt-3">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full gap-3">
        <AssignRoles userOptions={userOptions} roleOptions={roleOptions} />
      </div>
    </Authenticated>
  );
};

export default Index;
