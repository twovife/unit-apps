import InputError from '@/Components/InputError';
import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import useOptionGenerator from '@/Hooks/useOptionGenerator';
import SelectComponent from '@/Components/shadcn/SelectComponent';
// import RiwayatPengajuan from './RiwayatPengajuan';
import dayjs from 'dayjs';
import MobileLayout from '@/Layouts/MobileLayout';
import NewNasabah from '@/Pages/NewLoan/NewNasabah';

const Index = () => {
  return (
    <MobileLayout>
      <NewNasabah onClosed={() => void 0} />
    </MobileLayout>
  );
};

export default Index;
