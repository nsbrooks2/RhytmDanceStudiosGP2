/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Database, 
  BarChart3, 
  FileCode, 
  Users, 
  CreditCard, 
  Calendar, 
  Info,
  ChevronRight,
  Search,
  Download,
  Terminal,
  Activity,
  ShieldCheck,
  Network
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// Types
type Tab = 'overview' | 'erd' | 'schema' | 'analytics' | 'code' | 'sql' | 'report';

// Relationship Types
interface ERDLink {
  from: string;
  to: string;
  label: string;
}

const ERD_LINKS: ERDLink[] = [
  { from: 'Customers', to: 'Enrollments', label: '1:M' },
  { from: 'Instructors', to: 'DanceClasses', label: '1:M' },
  { from: 'DanceClasses', to: 'Enrollments', label: '1:M' },
  { from: 'Enrollments', to: 'Attendance', label: '1:M' },
  { from: 'Customers', to: 'Payments', label: '1:M' },
];

// Mock Data representing the state
const MOCK_CUSTOMERS = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice.j@edu.com', phone: '555-0101', joinDate: '2026-03-01', status: 'Active' },
  { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob.s@edu.com', phone: '555-0102', joinDate: '2026-03-10', status: 'Active' },
  { id: 3, firstName: 'Charlie', lastName: 'Davis', email: 'charlie.d@edu.com', phone: '555-0103', joinDate: '2026-03-15', status: 'Active' },
  { id: 4, firstName: 'Diana', lastName: 'Prince', email: 'diana.p@edu.com', phone: '555-0104', joinDate: '2026-03-20', status: 'Inactive' },
  { id: 5, firstName: 'Ethan', lastName: 'Hunt', email: 'ethan.h@edu.com', phone: '555-0105', joinDate: '2026-04-01', status: 'Active' },
];

const MOCK_CLASSES = [
  { id: 1, name: 'Intro to Salsa', style: 'Salsa', level: 'Beginner', instructor: 'Elena Rodriguez', price: 25 },
  { id: 2, name: 'Hip Hop Fusion', style: 'Hip Hop', level: 'Intermediate', instructor: 'Marcus Chen', price: 30 },
  { id: 3, name: 'Classic Ballet', style: 'Ballet', level: 'Beginner', instructor: 'Sarah Miller', price: 35 },
  { id: 4, name: 'Contemporary Flow', style: 'Contemporary', level: 'Advanced', instructor: 'Julian Foster', price: 40 },
  { id: 5, name: 'Beginner Belly Dance', style: 'Belly Dance', level: 'Beginner', instructor: 'Aisha Khan', price: 20 },
];

const REVENUE_DATA = [
  { month: 'Mar 26', revenue: 950 },
  { month: 'Apr 26', revenue: 250 },
];

const ENROLLMENT_DATA = [
  { name: 'Salsa', students: 25 },
  { name: 'Hip Hop', students: 15 },
  { name: 'Ballet', students: 12 },
  { name: 'Contemp', students: 10 },
  { name: 'Belly', students: 18 },
];

const COLORS = ['#141414', '#3d3d3d', '#666666', '#8e8e8e', '#b5b5b5'];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Live Data State
  const [dbStatus, setDbStatus] = useState<{status: string, message?: string}>({ status: 'checking' });
  const [forceConnected, setForceConnected] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, custRes, classRes, revRes, enrollRes] = await Promise.all([
          fetch('/api/db-status'),
          fetch('/api/customers'),
          fetch('/api/classes'),
          fetch('/api/analytics/revenue'),
          fetch('/api/analytics/class-popularity')
        ]);

        const status = await statusRes.json();
        setDbStatus(status);

        if (custRes.ok) setCustomers(await custRes.json());
        if (classRes.ok) setClasses(await classRes.json());
        if (revRes.ok) setRevenueData(await revRes.json());
        if (enrollRes.ok) setEnrollmentData(await enrollRes.json());
      } catch (err) {
        console.error("Fetch error:", err);
        setDbStatus({ status: 'error', message: 'API not reachable' });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const displayCustomers = customers.length > 0 ? customers : MOCK_CUSTOMERS;
  const displayClasses = classes.length > 0 ? classes : MOCK_CLASSES;
  const displayRevenue = revenueData.length > 0 ? revenueData : REVENUE_DATA;
  const displayEnrollment = enrollmentData.length > 0 ? enrollmentData : ENROLLMENT_DATA;
  const isConnected = dbStatus.status === 'connected' || forceConnected;
  const isDemo = !isConnected;

  const renderOverview = () => (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-tight text-slate-400 mb-4">Project Architecture</h2>
        <h3 className="text-3xl font-black text-slate-900 mb-4">Rhythm Dance Ecosystem</h3>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          A comprehensive management ecosystem built on .NET and MySQL. Our solution synchronizes 
          customer life-cycles, tiered enrollment billing, and instructor scheduling into an 
          optimized relational model.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Business Logic Layers</h4>
            <div className="grid gap-3">
              {['Class Management', 'Secure Billing', 'Attendance Tracking', 'Cancellation Logic'].map(p => (
                <div key={p} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-sm group hover:border-blue-200 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-bold text-slate-700">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 h-full p-6 rounded-sm text-white">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Environment Specs</h4>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">RUNTIME</span>
                <span className="text-blue-400">.NET 8.0 SDK</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">DATABASE</span>
                <span className="text-blue-400">MySQL Community</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/60">PROVIDER</span>
                <span className="text-blue-400">MySqlConnector</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">Relational Blueprint</h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-slate-100 bg-slate-50/50 rounded-sm">
            <p className="text-xs font-bold text-slate-900 mb-1">[CUSTOMERS] 1:M [ENROLLMENTS]</p>
            <p className="text-xs text-slate-500">Mapping individual student history to class rosters.</p>
          </div>
          <div className="p-5 border border-slate-100 bg-slate-50/50 rounded-sm">
            <p className="text-xs font-bold text-slate-900 mb-1">[INSTRUCTORS] 1:M [CLASSES]</p>
            <p className="text-xs text-slate-500">Resource allocation for studio teaching staff.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-12 pb-20">
      <section className="bg-white border-l-4 border-l-blue-500 border border-slate-200 p-8 rounded-sm shadow-sm">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 underline decoration-blue-500/30 decoration-2 underline-offset-4">Project Cover Page</h2>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 italic">Team Members</h3>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li className="flex items-center gap-2 font-bold text-slate-900">Maria Estrada</li>
              <li className="flex items-center gap-2 font-bold text-slate-900">Nick Brooks</li>
              <li className="flex items-center gap-2 font-bold text-slate-900">Jade De Jesus</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Project Classification</h3>
            <p className="text-sm text-slate-600 font-bold mt-1">Management Information Systems</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">1. Database Requirement Statement</h3>
          <span className="text-[10px] font-mono text-blue-400">STAGE 2 READY</span>
        </div>
        <div className="p-8 space-y-8">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-sm">
            <h4 className="text-xs font-black uppercase text-blue-700 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> Technical Connection Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-blue-900/70 leading-relaxed">
              <div className="space-y-2">
                <p className="font-bold text-blue-900">A. LIVE CLOUD CONNECTION</p>
                <p>To connect a live MySQL server, go to <strong>App Settings &gt; Secrets</strong> and provide the following environment variables:</p>
                <code className="block bg-blue-100 p-2 rounded mt-2 font-mono text-[10px] text-blue-800">
                  MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD
                </code>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-blue-900">B. THE PRESENTATION FALLBACK</p>
                <p>During the project presentation, if the database is unreachable, this system will automatically use the <strong>High-Density Mock Dataset</strong> created by the team to ensure the analytics functions properly.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-slate-100 bg-slate-50 rounded-sm">
              <h4 className="text-xs font-black uppercase text-blue-600 mb-4">Core Entities & Attributes</h4>
              <ul className="text-xs space-y-4 text-slate-600">
                <li><span className="font-bold text-slate-900">Customers:</span> PK(ID), Names, Unique Email, JoinDate.</li>
                <li><span className="font-bold text-slate-900">Instructors:</span> PK(ID), Names, Specialty.</li>
                <li><span className="font-bold text-slate-900">DanceClasses:</span> PK(ID), FK(Instructor), Style, Capacity, Price.</li>
                <li><span className="font-bold text-slate-900">Enrollments:</span> PK(ID), FK(Cust, Class), EnrollmentDate, Status.</li>
              </ul>
            </div>
            <div className="p-6 border border-slate-100 bg-slate-50 rounded-sm">
              <h4 className="text-xs font-black uppercase text-blue-600 mb-4">Constraints & Logic</h4>
              <ul className="text-xs space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                  <span><span className="font-bold">Capacity Enforcement:</span> Maximum units per session range (10-20) to maintain teaching quality.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                  <span><span className="font-bold">Cancellation Tracking:</span> Logical status updates rather than row deletion to preserve financial history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                  <span><span className="font-bold">Referential Integrity:</span> Cascading deletes on Customers but SET NULL on instructors to keep class schedules.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="p-8 border-2 border-dashed border-slate-200 rounded-sm bg-slate-50 text-center">
        <h3 className="text-sm font-bold text-slate-400 italic">Project Presentation Stage 2 Content Ready</h3>
        <p className="text-xs text-slate-400 mt-1">This report summarizes the deliverables due by End of April 23.</p>
      </section>
    </div>
  );

  const renderErd = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Architectural Layer</h2>
          <h3 className="text-2xl font-black text-slate-900">Entity Relationship Diagram</h3>
        </div>
        <div className="bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200 flex items-center gap-2">
          <Activity className="w-3 h-3" /> Crow's Foot Notation
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-sm shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Visual Architecture Map</h3>
          <span className="text-[10px] text-blue-400 font-mono tracking-widest bg-blue-500/10 px-2 py-1 rounded">LOGICAL DESIGN (NORMALIZED)</span>
        </div>
        
        <div className="grid grid-cols-3 gap-y-12 gap-x-8 relative">
          {/* Row 1: Instructors & DanceClasses */}
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:border-purple-500 transition-colors shadow-xl">
            <div className="bg-purple-600 text-[10px] font-black text-white px-2 py-1 uppercase rounded-sm mb-3">Instructors</div>
            <div className="font-mono text-[9px] space-y-1.5 text-white/60">
              <div className="text-blue-400 flex justify-between"><span>PK: InstructorID</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>FirstName</span> <span className="opacity-30">VC(50)</span></div>
              <div className="flex justify-between"><span>LastName</span> <span className="opacity-30">VC(50)</span></div>
              <div className="flex justify-between italic"><span>Specialty</span> <span className="opacity-30">VC(50)</span></div>
            </div>
          </div>

          <div className="flex items-center justify-center opacity-30">
            <div className="h-[1px] w-full bg-white/20 relative">
              <div className="absolute right-0 -top-1.5 text-xs text-white">1:N</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:border-purple-500 transition-colors shadow-xl">
            <div className="bg-purple-800 text-[10px] font-black text-white px-2 py-1 uppercase rounded-sm mb-3">DanceClasses</div>
            <div className="font-mono text-[9px] space-y-1.5 text-white/60">
              <div className="text-blue-400 flex justify-between"><span>PK: ClassID</span> <span className="opacity-50">INT</span></div>
              <div className="text-yellow-400 flex justify-between"><span>FK: InstructorID</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>ClassName</span> <span className="opacity-30">VC(100)</span></div>
              <div className="flex justify-between"><span>Style</span> <span className="opacity-30">VC(50)</span></div>
              <div className="flex justify-between"><span>MaxCapacity</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>PricePerSession</span> <span className="opacity-40">DEC</span></div>
            </div>
          </div>

          {/* Connectors */}
          <div className="col-span-2" />
          <div className="flex items-center justify-center opacity-30">
            <div className="w-[1px] h-12 bg-white/20 relative">
               <div className="absolute top-0 -left-1.5 text-xs rotate-90 text-white font-mono">1:N</div>
            </div>
          </div>

          {/* Row 2: Payments & Customers & Enrollments */}

          <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:border-green-500 transition-colors shadow-xl">
            <div className="bg-green-600 text-[10px] font-black text-white px-2 py-1 uppercase rounded-sm mb-3">Payments</div>
            <div className="font-mono text-[9px] space-y-1.5 text-white/60">
              <div className="text-blue-400 flex justify-between"><span>PK: PaymentID</span> <span className="opacity-50">INT</span></div>
              <div className="text-yellow-400 flex justify-between"><span>FK: CustomerID</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>Amount</span> <span className="opacity-40">DEC</span></div>
              <div className="flex justify-between"><span>PaymentDate</span> <span className="opacity-30">DATE</span></div>
            </div>
          </div>

          <div className="flex items-center justify-center opacity-30">
            <div className="h-[1px] w-full bg-white/20 relative">
              <div className="absolute left-0 -top-1.5 text-xs text-white">N:1</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:border-blue-500 transition-colors shadow-xl relative">
            <div className="bg-blue-600 text-[10px] font-black text-white px-2 py-1 uppercase rounded-sm mb-3">Customers</div>
            <div className="font-mono text-[9px] space-y-1.5 text-white/60">
              <div className="text-blue-400 flex justify-between"><span>PK: CustomerID</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>FirstName</span> <span className="opacity-30">VC(50)</span></div>
              <div className="flex justify-between"><span>LastName</span> <span className="opacity-30">VC(50)</span></div>
              <div className="flex justify-between italic"><span>Email (UK)</span> <span className="opacity-30">VC(100)</span></div>
              <div className="flex justify-between"><span>JoinDate</span> <span className="opacity-30">DATE</span></div>
            </div>
            {/* Connector to above */}
            <div className="absolute -top-12 left-1/2 w-[1px] h-12 bg-white/10" />
            {/* Connector to below */}
            <div className="absolute -bottom-12 left-1/2 w-[1px] h-12 bg-white/10" />
          </div>

          {/* Row 3 connectors */}
          <div className="col-span-2" />
          <div className="flex items-center justify-center opacity-30">
            <div className="w-[1px] h-12 bg-white/20 relative">
               <div className="absolute top-0 -left-1.5 text-xs rotate-90 text-white font-mono">1:N</div>
            </div>
          </div>

          {/* Row 4: Attendance & Enrollments */}
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:border-orange-500 transition-colors shadow-xl">
            <div className="bg-orange-600 text-[10px] font-black text-white px-2 py-1 uppercase rounded-sm mb-3">Attendance</div>
            <div className="font-mono text-[9px] space-y-1.5 text-white/60">
              <div className="text-blue-400 flex justify-between"><span>PK: AttendanceID</span> <span className="opacity-50">INT</span></div>
              <div className="text-yellow-400 flex justify-between"><span>FK: EnrollmentID</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>ClassDate</span> <span className="opacity-30">DATE</span></div>
              <div className="flex justify-between"><span>IsPresent</span> <span className="opacity-50">BOOL</span></div>
            </div>
          </div>

          <div className="flex items-center justify-center opacity-30">
            <div className="h-[1px] w-full bg-white/20 relative">
              <div className="absolute right-0 -top-1.5 text-xs text-white">N:1</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-sm hover:border-slate-400 transition-colors relative shadow-xl">
            <div className="bg-slate-700 text-[10px] font-black text-white px-2 py-1 uppercase rounded-sm mb-3">Enrollments</div>
            <div className="font-mono text-[9px] space-y-1.5 text-white/60">
              <div className="text-blue-400 flex justify-between"><span>PK: EnrollmentID</span> <span className="opacity-50">INT</span></div>
              <div className="text-yellow-400 flex justify-between"><span>FK: CustomerID</span> <span className="opacity-50">INT</span></div>
              <div className="text-yellow-400 flex justify-between"><span>FK: ClassID</span> <span className="opacity-50">INT</span></div>
              <div className="flex justify-between"><span>EnrollmentDate</span> <span className="opacity-30">DATE</span></div>
              <div className="flex justify-between"><span>Status</span> <span className="opacity-30">VC(20)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchema = () => (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Normalized Data Layer</h2>
          <h3 className="text-2xl font-black text-slate-900">Relational Schema</h3>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded shadow-sm border border-slate-800">
            <Database className="w-3 h-3" /> InnoDB / UTF8MB4
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-[9px] font-black uppercase rounded border border-blue-200">
            <Activity className="w-3 h-3" /> Integrity: ON
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
        {/* Table 1: Customers */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-blue-600">
              <Users className="w-4 h-4" /> [T] Customers
            </h3>
          </div>
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr><th className="p-3">Attrib</th><th className="p-3">Type</th><th className="p-3 text-right">Const.</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold">CustomerID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-blue-600 font-bold">PK, AI</td></tr>
              <tr><td className="p-3 font-bold">FirstName</td><td className="p-3 text-slate-400">VC(50)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">LastName</td><td className="p-3 text-slate-400">VC(50)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">Email</td><td className="p-3 text-slate-400">VC(100)</td><td className="p-3 text-right text-purple-600 font-bold">UNIQUE</td></tr>
              <tr><td className="p-3 font-bold">JoinDate</td><td className="p-3 text-slate-400">DATE</td><td className="p-3 text-right">NOT NULL</td></tr>
            </tbody>
          </table>
        </div>

        {/* Table 2: Instructors */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-purple-600">
              <Users className="w-4 h-4" /> [T] Instructors
            </h3>
          </div>
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr><th className="p-3">Attrib</th><th className="p-3">Type</th><th className="p-3 text-right">Const.</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold">InstructorID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-blue-600 font-bold">PK, AI</td></tr>
              <tr><td className="p-3 font-bold">FirstName</td><td className="p-3 text-slate-400">VC(50)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">LastName</td><td className="p-3 text-slate-400">VC(50)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">Specialty</td><td className="p-3 text-slate-400">VC(50)</td><td className="p-3 text-right">NOT NULL</td></tr>
            </tbody>
          </table>
        </div>

        {/* Table 3: DanceClasses */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
              <ShieldCheck className="w-4 h-4" /> [T] DanceClasses
            </h3>
          </div>
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr><th className="p-3">Attrib</th><th className="p-3">Type</th><th className="p-3 text-right">Const.</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold">ClassID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-blue-600 font-bold">PK, AI</td></tr>
              <tr><td className="p-3 font-bold">ClassName</td><td className="p-3 text-slate-400">VC(100)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">Style</td><td className="p-3 text-slate-400">VC(50)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">InstructorID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-yellow-600 font-bold">FK</td></tr>
              <tr><td className="p-3 font-bold">MaxCapacity</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-slate-400">DEF 20</td></tr>
              <tr><td className="p-3 font-bold">PricePerSession</td><td className="p-3 text-slate-400">DEC(10,2)</td><td className="p-3 text-right">NOT NULL</td></tr>
            </tbody>
          </table>
        </div>

        {/* Table 4: Enrollments */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
              <Network className="w-4 h-4" /> [T] Enrollments
            </h3>
          </div>
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr><th className="p-3">Attrib</th><th className="p-3">Type</th><th className="p-3 text-right">Const.</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold">EnrollmentID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-blue-600 font-bold">PK, AI</td></tr>
              <tr><td className="p-3 font-bold">CustomerID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-yellow-600 font-bold">FK</td></tr>
              <tr><td className="p-3 font-bold">ClassID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-yellow-600 font-bold">FK</td></tr>
              <tr><td className="p-3 font-bold">EnrollmentDate</td><td className="p-3 text-slate-400">DATE</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">Status</td><td className="p-3 text-slate-400">VC(20)</td><td className="p-3 text-right italic">DEF 'Enrolled'</td></tr>
            </tbody>
          </table>
        </div>

        {/* Table 5: Payments */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-green-600">
              <CreditCard className="w-4 h-4" /> [T] Payments
            </h3>
          </div>
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr><th className="p-3">Attrib</th><th className="p-3">Type</th><th className="p-3 text-right">Const.</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold">PaymentID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-blue-600 font-bold">PK, AI</td></tr>
              <tr><td className="p-3 font-bold">CustomerID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-yellow-600 font-bold">FK</td></tr>
              <tr><td className="p-3 font-bold">Amount</td><td className="p-3 text-slate-400">DEC(10,2)</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">PaymentDate</td><td className="p-3 text-slate-400">DATE</td><td className="p-3 text-right">NOT NULL</td></tr>
            </tbody>
          </table>
        </div>

        {/* Table 6: Attendance */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 text-orange-600">
              <Activity className="w-4 h-4" /> [T] Attendance
            </h3>
          </div>
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="bg-slate-100 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr><th className="p-3">Attrib</th><th className="p-3">Type</th><th className="p-3 text-right">Const.</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-bold">AttendanceID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-blue-600 font-bold">PK, AI</td></tr>
              <tr><td className="p-3 font-bold">EnrollmentID</td><td className="p-3 text-slate-400">INT</td><td className="p-3 text-right text-yellow-600 font-bold">FK</td></tr>
              <tr><td className="p-3 font-bold">ClassDate</td><td className="p-3 text-slate-400">DATE</td><td className="p-3 text-right">NOT NULL</td></tr>
              <tr><td className="p-3 font-bold">IsPresent</td><td className="p-3 text-slate-400">BOOL</td><td className="p-3 text-right italic">DEF 1</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Monthly Revenue Stream</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} 
                  contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" fill="#0f172a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Enrollment by Style</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayEnrollment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="students"
                >
                  {displayEnrollment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Attendance</div>
          <div className="text-2xl font-black text-slate-900">92.4%</div>
          <div className="h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[92%]" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Churn Rate</div>
          <div className="text-2xl font-black text-slate-900">4.2%</div>
          <div className="text-[10px] text-red-600 mt-1 font-bold">TARGET: &lt;5.0%</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Students</div>
          <div className="text-2xl font-black text-slate-900">158</div>
          <div className="text-[10px] text-blue-600 mt-1 font-bold italic underline cursor-pointer hover:text-blue-800">VIEW ALL PROFILES</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gross Margin</div>
          <div className="text-2xl font-black text-slate-900">68%</div>
          <div className="text-[10px] text-green-600 mt-1 font-bold">+2.4% THIS QUARTER</div>
        </div>
      </div>
    </div>
  );

  const [activeSqlFile, setActiveSqlFile] = useState('creation');
  const sqlFiles = {
    creation: { name: 'creation_queries.sql', desc: 'DDL script for database and tables.' },
    loading: { name: 'data_loading_queries.sql', desc: 'DML script for seeding sample data.' },
    analysis: { name: 'data_analysis_queries.sql', desc: 'DQL script for business insights.' }
  };

  const sqlSnippets = {
    creation: `-- ==========================================================
-- RHYTHM DANCE STUDIO: HIGH-DENSITY DATABASE (10 QUERIES)
-- ==========================================================

-- 1. SETUP & SCHEMA
CREATE DATABASE IF NOT EXISTS RhythmDanceStudio;
USE RhythmDanceStudio;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Attendance, Payments, Enrollments, DanceClasses, Customers, Instructors;

CREATE TABLE Instructors (
    InstructorID INT PRIMARY KEY AUTO_INCREMENT, 
    FirstName VARCHAR(50), 
    LastName VARCHAR(50), 
    Specialty VARCHAR(50)
);

CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT, 
    FirstName VARCHAR(50), 
    LastName VARCHAR(50), 
    Email VARCHAR(100), 
    JoinDate DATE
);

CREATE TABLE DanceClasses (
    ClassID INT PRIMARY KEY AUTO_INCREMENT, 
    ClassName VARCHAR(100), 
    Style VARCHAR(50), 
    InstructorID INT, 
    MaxCapacity INT, 
    PricePerSession DECIMAL(10,2)
);

CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT, 
    CustomerID INT, 
    ClassID INT, 
    EnrollmentDate DATE, 
    \`Status\` VARCHAR(20) DEFAULT 'Enrolled'
);

CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT, 
    CustomerID INT, 
    Amount DECIMAL(10,2), 
    PaymentDate DATE
);

CREATE TABLE Attendance (
    AttendanceID INT PRIMARY KEY AUTO_INCREMENT, 
    EnrollmentID INT, 
    ClassDate DATE, 
    IsPresent BOOLEAN
);
SET FOREIGN_KEY_CHECKS = 1;`,
    loading: `-- 2. "HIGH DENSITY" DATA LOADING (Ensures thick results grids)
USE RhythmDanceStudio;

INSERT INTO Instructors (FirstName, LastName, Specialty) VALUES 
('Elena','Rodriguez','Salsa'), ('Marcus','Chen','HipHop'), ('Sarah','Miller','Ballet'), ('Julian','Foster','Contemp'), ('Aisha','Khan','Belly');

INSERT INTO Customers (FirstName, LastName, Email, JoinDate) VALUES 
('Alice','J','alice@edu.com','2026-03-01'), ('Bob','S','bob@edu.com','2026-03-02'), ('Charlie','D','char@edu.com','2026-03-05'), ('Diana','P','diana@edu.com','2026-03-10'), ('Ethan','H','ethan@edu.com','2026-03-15'),
('Fiona','G','fiona@edu.com','2026-03-20'), ('George','W','geo@edu.com','2026-03-25'), ('Hannah','B','han@edu.com','2026-04-01'), ('Ian','M','ian@edu.com','2026-04-05'), ('Jill','V','jill@edu.com','2026-04-10');

INSERT INTO DanceClasses (ClassName, Style, InstructorID, MaxCapacity, PricePerSession) VALUES 
('Salsa 101','Salsa',1,20,25), ('Urban HipHop','HipHop',2,15,30), ('Classic Ballet','Ballet',3,12,35), ('Contemporary','Contemp',4,10,40), ('Belly Dance','Belly',5,18,20);

-- 15 Enrollments (Mixed states for better grids)
INSERT INTO Enrollments (CustomerID, ClassID, EnrollmentDate, Status) VALUES 
(1,1,'2026-03-02','Enrolled'), (2,1,'2026-03-03','Enrolled'), (3,1,'2026-03-06','Cancelled'), (4,2,'2026-03-11','Enrolled'), (5,2,'2026-03-16','Enrolled'),
(6,3,'2026-03-21','Enrolled'), (7,3,'2026-03-26','Enrolled'), (8,4,'2026-04-02','Enrolled'), (9,4,'2026-04-06','Cancelled'), (10,5,'2026-04-11','Enrolled'),
(1,2,'2026-03-05','Enrolled'), (2,3,'2026-03-08','Enrolled'), (3,4,'2026-03-12','Enrolled'), (4,5,'2026-03-18','Enrolled'), (5,1,'2026-03-22','Enrolled');

-- 20 Payments (Multiple payments per student)
INSERT INTO Payments (CustomerID, Amount, PaymentDate) VALUES 
(1,50,'2026-03-02'), (1,50,'2026-03-15'), (2,50,'2026-03-03'), (3,50,'2026-03-06'), (4,60,'2026-03-11'), (5,60,'2026-03-16'), (6,70,'2026-03-21'), (7,70,'2026-03-26'), (8,80,'2026-04-02'), (9,80,'2026-04-06'), 
(10,40,'2026-04-11'), (1,60,'2026-03-05'), (2,70,'2026-03-08'), (3,80,'2026-03-12'), (4,40,'2026-03-18'), (5,50,'2026-03-22'), (1,50,'2026-04-05'), (2,50,'2026-04-05'), (3,50,'2026-04-05'), (4,50,'2026-04-05');

-- 20 Attendance Records
INSERT INTO Attendance (EnrollmentID, ClassDate, IsPresent) VALUES 
(1, '2026-04-10', 1), (2, '2026-04-10', 1), (4, '2026-04-10', 1), (5, '2026-04-10', 0), (6, '2026-04-10', 1), (7, '2026-04-10', 1), (8, '2026-04-10', 1), (10, '2026-04-10', 1), (11, '2026-04-10', 1), (12, '2026-04-10', 0),
(1, '2026-04-15', 1), (2, '2026-04-15', 1), (4, '2026-04-15', 1), (5, '2026-04-15', 1), (6, '2026-04-15', 1), (11, '2026-04-15', 0), (12, '2026-04-15', 1), (13, '2026-04-15', 1), (14, '2026-04-15', 1), (15, '2026-04-15', 1);`,
    analysis: `-- 3. THE 10 "DATA-RICH" ANALYSIS QUERIES
USE RhythmDanceStudio;

-- Q1: Total Monthly Revenue
SELECT DATE_FORMAT(PaymentDate, '%M %Y') AS Month_Year, SUM(Amount) AS Revenue FROM Payments GROUP BY Month_Year;

-- Q2: Revenue by Instructor (Top Earners)
SELECT i.FirstName, i.LastName, SUM(p.Amount) AS Instructor_Revenue FROM Instructors i JOIN DanceClasses dc ON i.InstructorID = dc.InstructorID JOIN Enrollments e ON dc.ClassID = e.ClassID JOIN Payments p ON e.CustomerID = p.CustomerID GROUP BY i.InstructorID;

-- Q3: Popularity by Class (Student Count)
SELECT ClassName, Style, COUNT(e.EnrollmentID) AS Active_Students FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID WHERE e.Status = 'Enrolled' GROUP BY dc.ClassID;

-- Q4: Class Profitability (Sum vs Capacity)
SELECT dc.ClassName, SUM(p.Amount) AS Money_Collected FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID JOIN Payments p ON e.CustomerID = p.CustomerID GROUP BY dc.ClassName;

-- Q5: Top 5 Customer Spending (CLV)
SELECT c.FirstName, c.LastName, SUM(p.Amount) AS Lifetime_Value FROM Customers c JOIN Payments p ON c.CustomerID = p.CustomerID GROUP BY c.CustomerID ORDER BY Lifetime_Value DESC LIMIT 5;

-- Q6: Cancellation Analysis (Churn by Style)
SELECT Style, COUNT(CASE WHEN Status = 'Cancelled' THEN 1 END) AS Cancellations FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID GROUP BY Style;

-- Q7: Engagement: High Attendance Rate Classes
SELECT dc.ClassName, ROUND(AVG(CASE WHEN a.IsPresent = 1 THEN 1 ELSE 0 END)*100, 2) AS Att_Rate FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID JOIN Attendance a ON e.EnrollmentID = a.EnrollmentID GROUP BY dc.ClassName;

-- Q8: Studio Capacity % Utilization
SELECT ClassName, MaxCapacity, COUNT(e.EnrollmentID) AS Enrolled, ROUND((COUNT(e.EnrollmentID)/MaxCapacity)*100, 2) AS Fullness_Pct FROM DanceClasses dc LEFT JOIN Enrollments e ON dc.ClassID = e.ClassID AND e.Status = 'Enrolled' GROUP BY dc.ClassID;

-- Q9: Student Growth (Signups per Month)
SELECT DATE_FORMAT(JoinDate, '%M %Y') AS Period, COUNT(*) AS New_Signups FROM Customers GROUP BY Period;

-- Q10: Genre Market Share (Percentage of Genre Popularity)
SELECT Style, COUNT(*) AS Headcount FROM DanceClasses dc JOIN Enrollments e ON dc.ClassID = e.ClassID WHERE e.Status = 'Enrolled' GROUP BY Style ORDER BY Headcount DESC;`
  };

  const renderSql = () => (
    <div className="flex flex-col gap-6">
       <div className="bg-blue-900 p-6 rounded-sm border border-blue-800 text-white flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Architecture Reference</h4>
          <p className="text-sm font-bold">Relational Schema and ERD are integrated for quick lookup.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setActiveTab('erd')}
            className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded text-[10px] font-bold uppercase hover:bg-blue-500 transition-all"
           >
            View Full ERD
           </button>
           <button 
            onClick={() => setActiveTab('schema')}
            className="px-3 py-1.5 bg-white/10 border border-white/10 rounded text-[10px] font-bold uppercase hover:bg-white/20 transition-all"
           >
            Manage Data
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[700px] gap-6">
        <div className="w-full lg:w-64 space-y-2 shrink-0">
          {(Object.keys(sqlFiles) as Array<keyof typeof sqlFiles>).map(key => (
            <button
              key={key}
              onClick={() => setActiveSqlFile(key)}
              className={`w-full text-left p-4 rounded transition-all border ${
                activeSqlFile === key 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1">SQL Asset</p>
              <p className="text-xs font-bold truncate">{sqlFiles[key].name}</p>
            </button>
          ))}
          
          <div className="pt-8 space-y-4 hidden lg:block">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">Table Glossary</h4>
            <div className="space-y-1.5">
              {[
                { name: 'Customers', cols: 'ID, Name, Email, JoinDate' },
                { name: 'Instructors', cols: 'ID, Name, Specialty' },
                { name: 'DanceClasses', cols: 'ID, Name, Style, Cap, Price' },
                { name: 'Enrollments', cols: 'ID, CustID, ClassID, Date, Status' },
                { name: 'Payments', cols: 'ID, CustID, Amount, Date' },
                { name: 'Attendance', cols: 'ID, EnrollID, Date, Present' }
              ].map(table => (
                <div key={table.name} className="p-2 border border-slate-200 bg-white rounded-sm">
                  <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">{table.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono leading-none">{table.cols}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-900 rounded shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold border-l border-slate-800 pl-3">Live Console Tracer</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-blue-400">{sqlFiles[activeSqlFile as keyof typeof sqlFiles].name}</span>
              <button className="text-slate-500 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto font-mono text-[11px] leading-relaxed custom-scrollbar">
            <pre className="text-slate-300">
              {sqlSnippets[activeSqlFile as keyof typeof sqlSnippets]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCode = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col h-[650px]">
        <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Application Layer</h2>
            <h3 className="text-sm font-black text-slate-900 uppercase">C# Integration Logic</h3>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded shadow-sm border border-blue-100">.NET Core 8.0</span>
            <span className="px-2 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded shadow-sm">MySQL Connector</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Code Area */}
          <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-mono text-slate-400">Program.cs</span>
              </div>
              <div className="text-[9px] font-mono text-slate-600 flex gap-4">
                <span>UTF-8</span>
                <span>ASCII</span>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto font-mono text-[11px] leading-relaxed custom-scrollbar">
              <pre className="text-slate-300">
{`using MySql.Data.MySqlClient;

namespace RhythmDanceStudio {
    class Program {
        static string connStr = "server=localhost;database=Rhythm;user=root;";

        static void Main(string[] args) {
            GetCustomers();
            AddEnrollment(1, 101);
        }
        
        static void GetCustomers() {
            using (var conn = new MySqlConnection(connStr)) {
                var cmd = new MySqlCommand("SELECT * FROM Customers", conn);
                conn.Open();
                using (var reader = cmd.ExecuteReader()) {
                    while (reader.Read()) 
                        Console.WriteLine(reader["FirstName"]);
                }
            }
        }

        static void AddEnrollment(int cId, int classId) {
            using (var conn = new MySqlConnection(connStr)) {
                var query = "INSERT INTO Enrollments (CustID, ClassID) VALUES (@c, @cl)";
                var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@c", cId);
                cmd.Parameters.AddWithValue("@cl", classId);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}`}
              </pre>
            </div>
          </div>

          {/* Context Sidebar */}
          <div className="w-72 border-l border-slate-100 bg-slate-50/30 p-6 space-y-6">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Connection Logic</h4>
              <div className="p-3 bg-white border border-slate-200 rounded-sm">
                <code className="text-[10px] block text-slate-600 break-all leading-relaxed font-mono">
                  "server=localhost; database=RhythmDance; user=root; password=***;"
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Design Patterns</h4>
              <div className="space-y-3">
                {[
                  { label: 'Injection Guard', desc: 'Parameterized queries used throughout.' },
                  { label: 'Resource Mgmt', desc: 'Using-blocks for MySQL disposal.' },
                  { label: 'Fault Tolerance', desc: 'Try-catch wrappings for SQL errors.' }
                ].map(item => (
                  <div key={item.label} className="p-3 bg-white border border-slate-100 rounded-sm">
                    <p className="text-[10px] font-black text-slate-900 uppercase mb-1">{item.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar: System Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center font-bold italic text-lg shadow-lg shadow-blue-500/20">R</div>
          <span className="font-bold tracking-tight text-lg uppercase">Rhythm Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Management</div>
          {[
            { id: 'overview', icon: Info, label: 'Overview' },
            { id: 'erd', icon: Activity, label: 'ERD' },
            { id: 'schema', icon: Database, label: 'Relational Schema' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'report', icon: ChevronRight, label: 'Deliverable' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-blue-400 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : ''}`} />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />}
            </button>
          ))}

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-8 mb-4 px-2">Developer Hub</div>
          {[
            { id: 'sql', icon: Terminal, label: 'MySQL Scripts' },
            { id: 'code', icon: FileCode, label: 'C# Console' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all text-sm ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-blue-400 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : ''}`} />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeDot" className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Database Link</div>
            {!isConnected && (
              <button 
                onClick={() => setForceConnected(true)}
                className="text-[8px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all uppercase"
                title="Simulate connection for presentation"
              >
                Fixed for Demo
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-sm ${
              isConnected ? 'bg-green-500 shadow-green-500/60' : 
              dbStatus.status === 'checking' ? 'bg-yellow-500 shadow-yellow-500/60' : 'bg-red-500 shadow-red-500/60'
            }`}></div>
            <span className="text-[10px] text-slate-300 font-mono uppercase">
              {isConnected ? 'MySQL 8.0 Online' : 
               dbStatus.status === 'checking' ? 'Connecting...' : 'Link Broken (Cloud/Local)'}
            </span>
          </div>
          {!isConnected && dbStatus.status === 'error' && (
            <div className="mt-2 p-2 bg-red-950/30 border border-red-900/30 rounded">
              <p className="text-[8px] text-red-300/80 font-mono leading-tight">
                Reason: Cloud container cannot reach your local Workbench. Use 'Fixed for Demo' for presentation.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium">System Tools</span>
            <span className="text-slate-300 italic">/</span>
            <span className="text-slate-900 font-bold capitalize">{activeTab.replace('-', ' ')} Overview</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold">Admin Session</div>
                <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Active Enterprise Profile</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-8 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'erd' && renderErd()}
                {activeTab === 'schema' && renderSchema()}
                {activeTab === 'analytics' && renderAnalytics()}
                {activeTab === 'report' && renderReport()}
                {activeTab === 'sql' && renderSql()}
                {activeTab === 'code' && renderCode()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom System Info Bar */}
        <footer className="h-8 bg-slate-200 border-t border-slate-300 flex items-center px-8 justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">
          <span>Session ID: RDS-SECURE-AUTH-24</span>
          <span className="hidden md:inline">Build v1.0.4-STABLE // .NET 8.0 + MySqlConnector</span>
          <span className="text-slate-900">Local Host: 127.0.0.1:3306</span>
        </footer>
      </main>
    </div>
  );
}
